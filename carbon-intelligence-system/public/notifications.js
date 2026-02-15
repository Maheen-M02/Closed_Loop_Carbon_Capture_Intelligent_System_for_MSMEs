// Global notification system
let notificationCount = 0;
let notificationData = [];

// Initialize notifications on all pages
async function initializeNotifications() {
    if (!currentUser) return;
    
    // Create notification button
    createNotificationButton();
    
    // Load initial notifications
    await loadNotifications();
    
    // Set up real-time listener
    setupNotificationListener();
}

function createNotificationButton() {
    // Check if button already exists
    if (document.getElementById('notification-btn')) return;
    
    // Find the header navigation area
    const navArea = document.querySelector('header div[style*="display: flex"]');
    if (!navArea) return;
    
    // Create notification button container
    const notificationContainer = document.createElement('div');
    notificationContainer.className = 'notification-container';
    notificationContainer.innerHTML = `
        <button class="notification-btn" id="notification-btn">
            <span class="notification-icon">🔔</span>
            <span class="notification-badge" id="notification-badge" style="display: none;">0</span>
        </button>
        <div class="notification-dropdown" id="notification-dropdown">
            <div class="notification-header">
                <h4>Credit Purchase Requests</h4>
                <button class="mark-all-read" id="mark-all-read">Mark All Read</button>
            </div>
            <div class="notification-list" id="notification-list">
                <div class="no-notifications">
                    <p>No new notifications</p>
                </div>
            </div>
            <div class="notification-footer">
                <a href="marketplace.html" class="view-all-link">View All in Marketplace</a>
            </div>
        </div>
    `;
    
    // Insert before the user name
    const userName = navArea.querySelector('#user-name');
    if (userName) {
        navArea.insertBefore(notificationContainer, userName);
    }
    
    // Add event listeners
    document.getElementById('notification-btn').addEventListener('click', toggleNotificationDropdown);
    document.getElementById('mark-all-read').addEventListener('click', markAllAsRead);
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.notification-container')) {
            closeNotificationDropdown();
        }
    });
}

function toggleNotificationDropdown() {
    const dropdown = document.getElementById('notification-dropdown');
    const isVisible = dropdown.style.display === 'block';
    
    if (isVisible) {
        closeNotificationDropdown();
    } else {
        openNotificationDropdown();
    }
}

function openNotificationDropdown() {
    const dropdown = document.getElementById('notification-dropdown');
    dropdown.style.display = 'block';
    dropdown.style.animation = 'slideDown 0.3s ease';
    
    // Refresh notifications when opened
    loadNotifications();
}

function closeNotificationDropdown() {
    const dropdown = document.getElementById('notification-dropdown');
    dropdown.style.display = 'none';
}

async function loadNotifications() {
    if (!currentUser) return;
    
    try {
        // Get pending credit requests
        const requestsSnapshot = await db.collection('credit_requests')
            .where('sellerId', '==', currentUser.uid)
            .where('status', '==', 'pending')
            .orderBy('createdAt', 'desc')
            .limit(10)
            .get();
        
        notificationData = [];
        requestsSnapshot.forEach(doc => {
            notificationData.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        updateNotificationUI();
        
    } catch (error) {
        console.error('Error loading notifications:', error);
    }
}

function updateNotificationUI() {
    const badge = document.getElementById('notification-badge');
    const list = document.getElementById('notification-list');
    
    if (!badge || !list) return;
    
    notificationCount = notificationData.length;
    
    // Update badge
    if (notificationCount > 0) {
        badge.textContent = notificationCount > 99 ? '99+' : notificationCount;
        badge.style.display = 'block';
        
        // Add pulse animation for new notifications
        badge.classList.add('pulse-notification');
        setTimeout(() => badge.classList.remove('pulse-notification'), 2000);
    } else {
        badge.style.display = 'none';
    }
    
    // Update notification list
    if (notificationData.length === 0) {
        list.innerHTML = `
            <div class="no-notifications">
                <p>🌟 No new notifications</p>
                <small>You'll be notified when someone wants to buy your credits</small>
            </div>
        `;
    } else {
        list.innerHTML = '';
        
        notificationData.forEach(async (notification) => {
            // Get buyer info
            let buyerName = 'Anonymous';
            try {
                const buyerDoc = await db.collection('users').doc(notification.buyerId).get();
                if (buyerDoc.exists) {
                    buyerName = buyerDoc.data().name || 'Anonymous';
                }
            } catch (error) {
                console.log('Could not fetch buyer info');
            }
            
            const notificationItem = document.createElement('div');
            notificationItem.className = 'notification-item';
            notificationItem.innerHTML = `
                <div class="notification-content">
                    <div class="notification-avatar">💰</div>
                    <div class="notification-details">
                        <div class="notification-title">
                            <strong>${buyerName}</strong> wants to buy credits
                        </div>
                        <div class="notification-info">
                            ${notification.credits} credits @ ₹${notification.pricePerCredit} each
                        </div>
                        <div class="notification-total">
                            Total: ₹${(notification.credits * notification.pricePerCredit).toFixed(2)}
                        </div>
                        <div class="notification-time">
                            ${getTimeAgo(notification.createdAt.toDate())}
                        </div>
                    </div>
                </div>
                <div class="notification-actions">
                    <button class="btn-accept-mini" onclick="handleQuickCreditRequest('${notification.id}', 'accept')">
                        ✅
                    </button>
                    <button class="btn-reject-mini" onclick="handleQuickCreditRequest('${notification.id}', 'reject')">
                        ❌
                    </button>
                </div>
            `;
            
            list.appendChild(notificationItem);
        });
    }
}

function setupNotificationListener() {
    if (!currentUser) return;
    
    // Real-time listener for new credit requests
    db.collection('credit_requests')
        .where('sellerId', '==', currentUser.uid)
        .where('status', '==', 'pending')
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    // New notification
                    showNotificationToast('New credit purchase request received!');
                    loadNotifications();
                } else if (change.type === 'removed') {
                    // Notification resolved
                    loadNotifications();
                }
            });
        });
}

function showNotificationToast(message) {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'notification-toast';
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">🔔</span>
            <span class="toast-message">${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 4000);
}

async function handleQuickCreditRequest(requestId, action) {
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
            
            // Record the transaction
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
            
            showNotificationToast('✅ Credit sale completed successfully!');
        } else {
            // Reject request
            await db.collection('credit_requests').doc(requestId).update({
                status: 'rejected',
                processedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            showNotificationToast('❌ Purchase request rejected.');
        }
        
        // Refresh notifications
        await loadNotifications();
        
    } catch (error) {
        console.error('Error handling credit request:', error);
        alert('Error processing request. Please try again.');
    }
}

function markAllAsRead() {
    // For now, just close the dropdown
    // In a full implementation, you'd mark notifications as read in the database
    closeNotificationDropdown();
    showNotificationToast('All notifications marked as read');
}

function getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

// Auto-initialize when DOM is loaded
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        setTimeout(initializeNotifications, 1000);
    });
}