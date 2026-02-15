// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDsOUEY5lQYeuJlxZmYd55HcUQUoEOurWc",
    authDomain: "closed-loop-carbon-intel.firebaseapp.com",
    projectId: "closed-loop-carbon-intel",
    storageBucket: "closed-loop-carbon-intel.firebasestorage.app",
    messagingSenderId: "821631521087",
    appId: "1:821631521087:web:02a4519e52e9bd1903438a",
    measurementId: "G-GX47TQSQRW"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let currentUser = null;
let currentSellListing = null;
let allListings = []; // Store all listings for filtering

// Check authentication status
auth.onAuthStateChanged(async (user) => {
    if (user) {
        currentUser = user;
        const userName = user.displayName || user.email.split('@')[0];
        document.getElementById('user-name').textContent = `Hello, ${userName}`;
        
        await loadUserCredits();
        await loadMarketplaceListings();
        await loadNotifications();
    } else {
        window.location.href = 'login.html';
    }
});

// Logout functionality
document.getElementById('logout-btn').addEventListener('click', async () => {
    try {
        await auth.signOut();
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Logout error:', error);
        alert('Error logging out. Please try again.');
    }
});

// Modal controls
document.getElementById('sell-credits-btn').addEventListener('click', openSellModal);
document.getElementById('close-sell-modal').addEventListener('click', closeSellModal);
document.getElementById('close-buy-modal').addEventListener('click', closeBuyModal);
document.getElementById('refresh-marketplace').addEventListener('click', loadMarketplaceListings);

// Form submissions
document.getElementById('sell-credits-form').addEventListener('submit', handleSellCredits);
document.getElementById('buy-credits-form').addEventListener('submit', handleBuyCredits);

// Filter event listeners
document.getElementById('price-filter').addEventListener('change', applyFilters);
document.getElementById('industry-filter-market').addEventListener('change', applyFilters);
document.getElementById('sort-filter').addEventListener('change', applyFilters);

// Calculate total cost when quantity changes
document.getElementById('credits-to-buy').addEventListener('input', updateTotalCost);

async function loadUserCredits() {
    try {
        const currentYear = new Date().getFullYear();
        const yearStart = new Date(currentYear, 0, 1);
        
        // Get user's current year emissions
        const emissionsSnapshot = await db.collection('users')
            .doc(currentUser.uid)
            .collection('emissions')
            .where('timestamp', '>=', yearStart)
            .get();
        
        let totalCredits = 0;
        emissionsSnapshot.forEach(doc => {
            const data = doc.data();
            totalCredits += parseFloat(data.carbon_credits) || 0;
        });
        
        // Get credits for sale
        const salesSnapshot = await db.collection('marketplace')
            .where('sellerId', '==', currentUser.uid)
            .where('status', '==', 'active')
            .get();
        
        let creditsForSale = 0;
        salesSnapshot.forEach(doc => {
            const data = doc.data();
            creditsForSale += parseFloat(data.credits);
        });
        
        // Get pending requests
        const requestsSnapshot = await db.collection('credit_requests')
            .where('sellerId', '==', currentUser.uid)
            .where('status', '==', 'pending')
            .get();
        
        const pendingRequests = requestsSnapshot.size;
        const availableCredits = totalCredits - creditsForSale;
        
        document.getElementById('available-credits').textContent = availableCredits.toFixed(2);
        document.getElementById('credits-for-sale').textContent = creditsForSale.toFixed(2);
        document.getElementById('pending-requests').textContent = pendingRequests;
        
        // Update max credits in sell modal
        document.getElementById('max-credits').textContent = availableCredits.toFixed(2);
        
    } catch (error) {
        console.error('Error loading user credits:', error);
    }
}

async function loadMarketplaceListings() {
    try {
        const listingsDiv = document.getElementById('marketplace-listings');
        listingsDiv.innerHTML = `
            <div class="floating-elements">
                <div class="floating-element"></div>
                <div class="floating-element"></div>
                <div class="floating-element"></div>
            </div>
            <div style="text-align: center; padding: 40px;">
                <div class="loading-shimmer" style="height: 100px; border-radius: 15px; margin-bottom: 20px;"></div>
                <p style="color: #4a7c59;">Loading marketplace...</p>
            </div>
        `;
        
        // Simplified query - just get active listings, exclude current user
        const snapshot = await db.collection('marketplace')
            .where('status', '==', 'active')
            .get();
        
        // Filter out current user's listings and store all listings
        allListings = [];
        for (const doc of snapshot.docs) {
            const listing = doc.data();
            if (listing.sellerId !== currentUser.uid) {
                // Get seller info
                let sellerName = 'Anonymous';
                let sellerCompany = '';
                try {
                    const sellerDoc = await db.collection('users').doc(listing.sellerId).get();
                    if (sellerDoc.exists) {
                        const sellerData = sellerDoc.data();
                        sellerName = sellerData.name || 'Anonymous';
                        sellerCompany = sellerData.company || '';
                    }
                } catch (error) {
                    console.log('Could not fetch seller info for', listing.sellerId);
                }
                
                allListings.push({
                    id: doc.id,
                    ...listing,
                    sellerName,
                    sellerCompany
                });
            }
        }
        
        // Apply current filters
        applyFilters();
        
    } catch (error) {
        console.error('Error loading marketplace listings:', error);
        document.getElementById('marketplace-listings').innerHTML = `
            <div class="floating-elements">
                <div class="floating-element"></div>
                <div class="floating-element"></div>
                <div class="floating-element"></div>
            </div>
            <div style="text-align: center; color: #e74c3c; padding: 40px;">
                <h3>⚠️ Error Loading Marketplace</h3>
                <p>Please refresh the page and try again.<br>
                <small>Error: ${error.message}</small></p>
            </div>
        `;
    }
}

function updateMarketplaceStats(totalListings, avgPrice) {
    document.getElementById('total-listings').textContent = totalListings;
    document.getElementById('avg-price').textContent = `₹${Math.round(avgPrice).toLocaleString()}`;
}

function applyFilters() {
    const priceFilter = document.getElementById('price-filter').value;
    const industryFilter = document.getElementById('industry-filter-market').value;
    const sortFilter = document.getElementById('sort-filter').value;
    
    // Update visual feedback for active filters
    updateFilterVisualFeedback(priceFilter, industryFilter, sortFilter);
    
    let filteredListings = [...allListings];
    
    // Apply price filter
    if (priceFilter !== 'all') {
        filteredListings = filteredListings.filter(listing => {
            const price = listing.pricePerCredit;
            switch (priceFilter) {
                case 'low':
                    return price >= 700 && price <= 1000;
                case 'medium':
                    return price > 1000 && price <= 1500;
                case 'high':
                    return price > 1500 && price <= 2000;
                default:
                    return true;
            }
        });
    }
    
    // Apply industry filter
    if (industryFilter !== 'all') {
        filteredListings = filteredListings.filter(listing => {
            const industry = (listing.industry || 'other').toLowerCase();
            return industry === industryFilter.toLowerCase();
        });
    }
    
    // Apply sorting
    switch (sortFilter) {
        case 'price-low':
            filteredListings.sort((a, b) => a.pricePerCredit - b.pricePerCredit);
            break;
        case 'price-high':
            filteredListings.sort((a, b) => b.pricePerCredit - a.pricePerCredit);
            break;
        case 'credits-high':
            filteredListings.sort((a, b) => b.credits - a.credits);
            break;
        case 'newest':
            filteredListings.sort((a, b) => {
                const aTime = a.createdAt ? a.createdAt.toDate().getTime() : 0;
                const bTime = b.createdAt ? b.createdAt.toDate().getTime() : 0;
                return bTime - aTime;
            });
            break;
        default:
            filteredListings.sort((a, b) => a.pricePerCredit - b.pricePerCredit);
    }
    
    // Display filtered listings
    displayListings(filteredListings);
}

function updateFilterVisualFeedback(priceFilter, industryFilter, sortFilter) {
    // Remove active class from all selects
    document.querySelectorAll('.marketplace-filters select').forEach(select => {
        select.classList.remove('active');
    });
    
    // Add active class to filters that are not 'all'
    if (priceFilter !== 'all') {
        document.getElementById('price-filter').classList.add('active');
    }
    if (industryFilter !== 'all') {
        document.getElementById('industry-filter-market').classList.add('active');
    }
    if (sortFilter !== 'price-low') {
        document.getElementById('sort-filter').classList.add('active');
    }
}

function displayListings(listings) {
    const listingsDiv = document.getElementById('marketplace-listings');
    
    if (listings.length === 0) {
        listingsDiv.innerHTML = `
            <div class="floating-elements">
                <div class="floating-element"></div>
                <div class="floating-element"></div>
                <div class="floating-element"></div>
            </div>
            <div class="no-listings">
                <h3>🔍 No Credits Match Your Filters</h3>
                <p>Try adjusting your filter criteria to see more listings.</p>
                <button class="btn-secondary" onclick="clearFilters()" style="margin-top: 15px;">Clear Filters</button>
            </div>
        `;
        updateMarketplaceStats(0, 0);
        return;
    }
    
    listingsDiv.innerHTML = `
        <div class="floating-elements">
            <div class="floating-element"></div>
            <div class="floating-element"></div>
            <div class="floating-element"></div>
        </div>
    `;
    
    let totalPrice = 0;
    
    listings.forEach((listing, index) => {
        totalPrice += listing.pricePerCredit;
        
        // Determine industry icon
        const industryIcons = {
            'textile': '🧵',
            'steel': '🏭',
            'other': '🏢'
        };
        const industryIcon = industryIcons[listing.industry?.toLowerCase()] || '🏢';
        
        // Create animated listing card
        const listingCard = document.createElement('div');
        listingCard.className = 'listing-card';
        listingCard.style.animationDelay = `${index * 0.1}s`;
        listingCard.style.animation = 'slideIn 0.6s ease forwards';
        
        listingCard.innerHTML = `
            <div class="industry-badge">${listing.industry || 'Mixed'}</div>
            <div class="listing-info">
                <h4>
                    ${industryIcon} ${listing.sellerName}
                    <span class="verified-badge">Verified</span>
                </h4>
                <div class="listing-details">
                    <div class="listing-detail">
                        <label>💎 Credits</label>
                        <span>${listing.credits}</span>
                    </div>
                    <div class="listing-detail">
                        <label>🏭 Industry</label>
                        <span>${listing.industry || 'Mixed'}</span>
                    </div>
                    <div class="listing-detail">
                        <label>📅 Listed</label>
                        <span>${listing.createdAt ? listing.createdAt.toDate().toLocaleDateString('en-IN') : 'Recently'}</span>
                    </div>
                    <div class="listing-detail">
                        <label>🏢 Company</label>
                        <span>${listing.sellerCompany || 'Private'}</span>
                    </div>
                </div>
                ${listing.description ? `
                    <div class="listing-description">
                        💬 "${listing.description}"
                    </div>
                ` : ''}
            </div>
            <div class="listing-actions">
                <div class="price-display">₹${listing.pricePerCredit.toLocaleString()}</div>
                <div class="price-per-credit">per credit</div>
                <div style="font-size: 0.8rem; color: #4a7c59; margin: 5px 0;">
                    Total: ₹${(listing.credits * listing.pricePerCredit).toLocaleString()}
                </div>
                <button class="btn-buy" onclick="redirectToCheckout('${listing.id}', ${listing.credits}, ${listing.pricePerCredit}, '${listing.sellerName.replace(/'/g, "\\'")}', '${listing.sellerId}')">
                    💰 Buy Credits
                </button>
            </div>
        `;
        
        listingsDiv.appendChild(listingCard);
    });
    
    // Update marketplace stats
    const avgPrice = totalPrice / listings.length;
    updateMarketplaceStats(listings.length, avgPrice);
    
    // Show filter results count if filtered
    const isFiltered = allListings.length !== listings.length;
    if (isFiltered) {
        const filterInfo = document.createElement('div');
        filterInfo.className = 'filter-results-info';
        filterInfo.style.cssText = `
            background: var(--light-green);
            padding: 10px 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
            color: var(--dark-green);
            font-weight: 600;
        `;
        filterInfo.innerHTML = `
            📊 Showing ${listings.length} of ${allListings.length} listings
            <button onclick="clearFilters()" style="margin-left: 10px; background: none; border: 1px solid var(--dark-green); color: var(--dark-green); padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                Show All
            </button>
        `;
        listingsDiv.insertBefore(filterInfo, listingsDiv.firstChild.nextSibling);
    }
}

function clearFilters() {
    document.getElementById('price-filter').value = 'all';
    document.getElementById('industry-filter-market').value = 'all';
    document.getElementById('sort-filter').value = 'price-low';
    
    // Remove active classes
    document.querySelectorAll('.marketplace-filters select').forEach(select => {
        select.classList.remove('active');
    });
    
    applyFilters();
}

async function loadNotifications() {
    try {
        const notificationsDiv = document.getElementById('notifications-list');
        
        // Get purchase requests for user's credits
        const requestsSnapshot = await db.collection('credit_requests')
            .where('sellerId', '==', currentUser.uid)
            .where('status', '==', 'pending')
            .orderBy('createdAt', 'desc')
            .get();
        
        if (requestsSnapshot.empty) {
            notificationsDiv.innerHTML = '<p style="text-align: center; color: #4a7c59; padding: 20px;">No notifications</p>';
            return;
        }
        
        notificationsDiv.innerHTML = '';
        
        for (const doc of requestsSnapshot.docs) {
            const request = doc.data();
            
            // Get buyer info
            const buyerDoc = await db.collection('users').doc(request.buyerId).get();
            const buyerName = buyerDoc.exists ? buyerDoc.data().name : 'Anonymous';
            
            const notificationDiv = document.createElement('div');
            notificationDiv.className = 'notification-item request';
            notificationDiv.innerHTML = `
                <div class="notification-header">
                    <div class="notification-title">💰 Credit Purchase Request</div>
                    <div class="notification-time">${request.createdAt.toDate().toLocaleString('en-IN')}</div>
                </div>
                <div class="notification-details">
                    <strong>${buyerName}</strong> wants to buy <strong>${request.credits} credits</strong> 
                    at <strong>₹${request.pricePerCredit}</strong> per credit.
                    <br>Total: <strong>₹${(request.credits * request.pricePerCredit).toFixed(2)}</strong>
                </div>
                <div class="notification-actions">
                    <button class="btn-accept" onclick="handleCreditRequest('${doc.id}', 'accept')">
                        ✅ Accept
                    </button>
                    <button class="btn-reject" onclick="handleCreditRequest('${doc.id}', 'reject')">
                        ❌ Reject
                    </button>
                </div>
            `;
            
            notificationsDiv.appendChild(notificationDiv);
        }
        
    } catch (error) {
        console.error('Error loading notifications:', error);
    }
}

function openSellModal() {
    document.getElementById('sell-modal').style.display = 'flex';
}

function closeSellModal() {
    document.getElementById('sell-modal').style.display = 'none';
    document.getElementById('sell-credits-form').reset();
}

function openBuyModal(listingId, availableCredits, pricePerCredit, sellerName) {
    // Find the listing to get sellerId
    const listing = allListings.find(l => l.id === listingId);
    if (!listing) {
        alert('Listing not found');
        return;
    }
    
    currentSellListing = { 
        id: listingId, 
        availableCredits, 
        pricePerCredit, 
        sellerName,
        sellerId: listing.sellerId
    };
    
    document.getElementById('buy-details').innerHTML = `
        <div style="background: var(--light-green); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h4>Purchasing from: ${sellerName}</h4>
            <p>Price: ₹${pricePerCredit} per credit</p>
            <p>Available: ${availableCredits} credits</p>
        </div>
    `;
    
    document.getElementById('max-buy-credits').textContent = availableCredits;
    document.getElementById('credits-to-buy').max = availableCredits;
    document.getElementById('buy-modal').style.display = 'flex';
}

function redirectToCheckout(listingId, availableCredits, pricePerCredit, sellerName, sellerId) {
    // Redirect to checkout page with order data
    const checkoutUrl = `checkout.html?listing=${listingId}&credits=${availableCredits}&price=${pricePerCredit}&seller=${encodeURIComponent(sellerName)}&sellerId=${sellerId}`;
    window.location.href = checkoutUrl;
}

function closeBuyModal() {
    document.getElementById('buy-modal').style.display = 'none';
    document.getElementById('buy-credits-form').reset();
    currentSellListing = null;
}

function updateTotalCost() {
    if (!currentSellListing) return;
    
    const credits = parseFloat(document.getElementById('credits-to-buy').value) || 0;
    const total = credits * currentSellListing.pricePerCredit;
    document.getElementById('total-cost').textContent = `₹${total.toFixed(2)}`;
}

async function handleSellCredits(e) {
    e.preventDefault();
    
    try {
        const credits = parseFloat(document.getElementById('credits-to-sell').value);
        const pricePerCredit = parseFloat(document.getElementById('price-per-credit').value);
        const description = document.getElementById('sale-description').value;
        
        await db.collection('marketplace').add({
            sellerId: currentUser.uid,
            credits: credits,
            pricePerCredit: pricePerCredit,
            description: description,
            status: 'active',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        alert('✅ Credits listed for sale successfully!');
        closeSellModal();
        await loadUserCredits();
        await loadMarketplaceListings();
        
    } catch (error) {
        console.error('Error listing credits for sale:', error);
        alert('Error listing credits. Please try again.');
    }
}

async function handleBuyCredits(e) {
    e.preventDefault();
    
    if (!currentSellListing) return;
    
    const credits = parseFloat(document.getElementById('credits-to-buy').value);
    
    // Redirect to checkout with selected quantity
    const checkoutUrl = `checkout.html?listing=${currentSellListing.id}&credits=${credits}&price=${currentSellListing.pricePerCredit}&seller=${encodeURIComponent(currentSellListing.sellerName)}&sellerId=${currentSellListing.sellerId}`;
    window.location.href = checkoutUrl;
}

async function handleCreditRequest(requestId, action) {
    try {
        const requestDoc = await db.collection('credit_requests').doc(requestId).get();
        if (!requestDoc.exists) {
            alert('Request not found.');
            return;
        }
        
        const requestData = requestDoc.data();
        
        if (action === 'accept') {
            // Update request status
            await db.collection('credit_requests').doc(requestId).update({
                status: 'accepted',
                processedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Record the transaction in blockchain
            const transactionData = {
                type: 'CREDIT_TRANSFER',
                fromUserId: currentUser.uid,
                toUserId: requestData.buyerId,
                credits: requestData.credits,
                pricePerCredit: requestData.pricePerCredit,
                totalAmount: requestData.totalCost,
                timestamp: Date.now()
            };
            
            // Add to both users' transaction history
            await db.collection('users').doc(currentUser.uid).collection('transactions').add({
                ...transactionData,
                type: 'CREDIT_SALE'
            });
            
            await db.collection('users').doc(requestData.buyerId).collection('transactions').add({
                ...transactionData,
                type: 'CREDIT_PURCHASE'
            });
            
            alert('✅ Credit sale completed successfully!');
        } else {
            // Reject request
            await db.collection('credit_requests').doc(requestId).update({
                status: 'rejected',
                processedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            alert('❌ Purchase request rejected.');
        }
        
        await loadNotifications();
        await loadUserCredits();
        
    } catch (error) {
        console.error('Error handling credit request:', error);
        alert('Error processing request. Please try again.');
    }
}

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});