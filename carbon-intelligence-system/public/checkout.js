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
let orderData = null;

// Check authentication status
auth.onAuthStateChanged(async (user) => {
    if (user) {
        currentUser = user;
        const userName = user.displayName || user.email.split('@')[0];
        document.getElementById('user-name').textContent = `Hello, ${userName}`;
        
        // Pre-fill billing details
        document.getElementById('billing-name').value = user.displayName || '';
        document.getElementById('billing-email').value = user.email || '';
        
        // Load order data from URL parameters
        loadOrderData();
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

// Payment method selection
document.querySelectorAll('.payment-method').forEach(method => {
    method.addEventListener('click', () => {
        // Remove active class from all methods
        document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
        document.querySelectorAll('.payment-details').forEach(d => d.classList.remove('active'));
        
        // Add active class to selected method
        method.classList.add('active');
        const methodType = method.dataset.method;
        document.getElementById(`${methodType}-details`).classList.add('active');
    });
});

// Form validation and submission
document.getElementById('checkout-form').addEventListener('submit', handleCheckout);

// Input formatting
document.getElementById('card-number').addEventListener('input', formatCardNumber);
document.getElementById('card-expiry').addEventListener('input', formatCardExpiry);
document.getElementById('card-cvv').addEventListener('input', formatCVV);

function loadOrderData() {
    const urlParams = new URLSearchParams(window.location.search);
    const listingId = urlParams.get('listing');
    const credits = parseFloat(urlParams.get('credits')); // This could be user-selected quantity or max available
    const pricePerCredit = parseFloat(urlParams.get('price'));
    const sellerName = urlParams.get('seller');
    const sellerId = urlParams.get('sellerId');
    
    if (!listingId || !credits || !pricePerCredit || !sellerName || !sellerId) {
        alert('Invalid order data. Redirecting to marketplace.');
        window.location.href = 'marketplace.html';
        return;
    }
    
    orderData = {
        listingId,
        maxCredits: credits, // Assume this is the max available (or user selected)
        credits: credits,
        pricePerCredit,
        sellerName,
        sellerId,
        totalAmount: credits * pricePerCredit
    };
    
    displayOrderSummary();
}

function displayOrderSummary() {
    const orderSummaryDiv = document.getElementById('order-summary');
    
    orderSummaryDiv.innerHTML = `
        <div class="seller-info">
            <h3>🏭 Seller Information</h3>
            <p><strong>Name:</strong> ${orderData.sellerName}</p>
            <p><strong>Industry:</strong> Verified Carbon Credit Provider</p>
            <p><strong>Rating:</strong> ⭐⭐⭐⭐⭐ (4.8/5)</p>
        </div>
        
        <div class="quantity-selector">
            <h3>📊 Select Quantity</h3>
            <div style="display: flex; align-items: center; gap: 15px; margin: 15px 0;">
                <label for="credits-quantity" style="color: var(--dark-green); font-weight: 600;">Credits to Purchase:</label>
                <input type="number" id="credits-quantity" min="0.1" max="${orderData.maxCredits}" step="0.1" value="${orderData.credits}" 
                       style="width: 120px; padding: 8px 12px; border: 2px solid var(--light-green); border-radius: 6px;">
                <span style="color: #4a7c59;">/ ${orderData.maxCredits} available</span>
            </div>
        </div>
        
        <div class="order-item">
            <span>Carbon Credits</span>
            <span id="display-credits">${orderData.credits} credits</span>
        </div>
        <div class="order-item">
            <span>Price per Credit</span>
            <span>₹${orderData.pricePerCredit.toLocaleString()}</span>
        </div>
        <div class="order-item">
            <span>Subtotal</span>
            <span id="display-subtotal">₹${orderData.totalAmount.toLocaleString()}</span>
        </div>
        <div class="order-item">
            <span>Processing Fee (2%)</span>
            <span id="display-processing">₹${Math.round(orderData.totalAmount * 0.02).toLocaleString()}</span>
        </div>
        <div class="order-item">
            <span>GST (18%)</span>
            <span id="display-gst">₹${Math.round(orderData.totalAmount * 0.18).toLocaleString()}</span>
        </div>
        <div class="order-item">
            <span><strong>Total Amount</strong></span>
            <span id="display-total"><strong>₹${Math.round(orderData.totalAmount * 1.2).toLocaleString()}</strong></span>
        </div>
    `;
    
    // Update checkout button amount
    document.getElementById('checkout-total').textContent = `₹${Math.round(orderData.totalAmount * 1.2).toLocaleString()}`;
    
    // Add event listener for quantity changes
    document.getElementById('credits-quantity').addEventListener('input', updateOrderAmount);
}

function updateOrderAmount() {
    const newCredits = parseFloat(document.getElementById('credits-quantity').value) || 0;
    
    if (newCredits > orderData.maxCredits) {
        document.getElementById('credits-quantity').value = orderData.maxCredits;
        return;
    }
    
    if (newCredits < 0.1) {
        document.getElementById('credits-quantity').value = 0.1;
        return;
    }
    
    // Update order data
    orderData.credits = newCredits;
    orderData.totalAmount = newCredits * orderData.pricePerCredit;
    
    // Update display
    document.getElementById('display-credits').textContent = `${newCredits} credits`;
    document.getElementById('display-subtotal').textContent = `₹${orderData.totalAmount.toLocaleString()}`;
    document.getElementById('display-processing').textContent = `₹${Math.round(orderData.totalAmount * 0.02).toLocaleString()}`;
    document.getElementById('display-gst').textContent = `₹${Math.round(orderData.totalAmount * 0.18).toLocaleString()}`;
    document.getElementById('display-total').innerHTML = `<strong>₹${Math.round(orderData.totalAmount * 1.2).toLocaleString()}</strong>`;
    document.getElementById('checkout-total').textContent = `₹${Math.round(orderData.totalAmount * 1.2).toLocaleString()}`;
}

function formatCardNumber(e) {
    let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formattedValue;
}

function formatCardExpiry(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
}

function formatCVV(e) {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
}

function validateForm() {
    let isValid = true;
    const requiredFields = document.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        const formGroup = field.closest('.form-group');
        if (!field.value.trim()) {
            formGroup.classList.add('error');
            isValid = false;
        } else {
            formGroup.classList.remove('error');
        }
    });
    
    // Additional validation for specific fields
    const email = document.getElementById('billing-email');
    if (email.value && !isValidEmail(email.value)) {
        email.closest('.form-group').classList.add('error');
        isValid = false;
    }
    
    const activePaymentMethod = document.querySelector('.payment-method.active').dataset.method;
    
    if (activePaymentMethod === 'card') {
        const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
        if (cardNumber.length < 16) {
            document.getElementById('card-number').closest('.form-group').classList.add('error');
            isValid = false;
        }
        
        const cardExpiry = document.getElementById('card-expiry').value;
        if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
            document.getElementById('card-expiry').closest('.form-group').classList.add('error');
            isValid = false;
        }
        
        const cardCVV = document.getElementById('card-cvv').value;
        if (cardCVV.length < 3) {
            document.getElementById('card-cvv').closest('.form-group').classList.add('error');
            isValid = false;
        }
    }
    
    if (activePaymentMethod === 'upi') {
        const upiId = document.getElementById('upi-id').value;
        if (!isValidUPI(upiId)) {
            document.getElementById('upi-id').closest('.form-group').classList.add('error');
            isValid = false;
        }
    }
    
    return isValid;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidUPI(upi) {
    return /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upi);
}

async function handleCheckout(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        alert('Please fill in all required fields correctly.');
        return;
    }
    
    const checkoutBtn = document.getElementById('complete-purchase-btn');
    checkoutBtn.classList.add('loading');
    checkoutBtn.disabled = true;
    
    try {
        // Simulate payment processing
        await simulatePaymentProcessing();
        
        // Create purchase request in database
        const purchaseData = {
            buyerId: currentUser.uid,
            sellerId: orderData.sellerId,
            listingId: orderData.listingId,
            credits: orderData.credits,
            pricePerCredit: orderData.pricePerCredit,
            totalAmount: Math.round(orderData.totalAmount * 1.2),
            paymentMethod: document.querySelector('.payment-method.active').dataset.method,
            billingDetails: {
                name: document.getElementById('billing-name').value,
                email: document.getElementById('billing-email').value,
                company: document.getElementById('billing-company').value,
                phone: document.getElementById('billing-phone').value,
                address: document.getElementById('billing-address').value
            },
            status: 'completed',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            transactionId: generateTransactionId()
        };
        
        // Add to credit requests collection
        await db.collection('credit_requests').add(purchaseData);
        
        // Record transaction in blockchain
        const transactionData = {
            type: 'CREDIT_PURCHASE',
            fromUserId: orderData.sellerId,
            toUserId: currentUser.uid,
            credits: orderData.credits,
            pricePerCredit: orderData.pricePerCredit,
            totalAmount: purchaseData.totalAmount,
            timestamp: Date.now(),
            transactionId: purchaseData.transactionId
        };
        
        // Add to buyer's transaction history
        await db.collection('users').doc(currentUser.uid).collection('transactions').add({
            ...transactionData,
            type: 'CREDIT_PURCHASE'
        });
        
        // Show success modal
        showSuccessModal(purchaseData);
        
    } catch (error) {
        console.error('Checkout error:', error);
        alert('Payment failed. Please try again.');
    } finally {
        checkoutBtn.classList.remove('loading');
        checkoutBtn.disabled = false;
    }
}

function simulatePaymentProcessing() {
    return new Promise((resolve) => {
        setTimeout(resolve, 2000); // Simulate 2 second processing time
    });
}

function generateTransactionId() {
    return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
}

function showSuccessModal(purchaseData) {
    const modal = document.getElementById('success-modal');
    const detailsDiv = document.getElementById('success-details');
    
    detailsDiv.innerHTML = `
        <div class="order-item">
            <span>Transaction ID:</span>
            <span><strong>${purchaseData.transactionId}</strong></span>
        </div>
        <div class="order-item">
            <span>Credits Purchased:</span>
            <span><strong>${purchaseData.credits} credits</strong></span>
        </div>
        <div class="order-item">
            <span>Amount Paid:</span>
            <span><strong>₹${purchaseData.totalAmount.toLocaleString()}</strong></span>
        </div>
        <div class="order-item">
            <span>Seller:</span>
            <span><strong>${orderData.sellerName}</strong></span>
        </div>
        <div style="margin-top: 15px; padding: 15px; background: rgba(124, 255, 178, 0.2); border-radius: 8px; text-align: center;">
            <p style="color: var(--dark-green); margin: 0; font-weight: 600;">
                🎉 Your carbon credits will be available in your profile once the seller approves the transaction.
            </p>
        </div>
    `;
    
    modal.style.display = 'flex';
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// Handle browser back button
window.addEventListener('beforeunload', (e) => {
    if (orderData) {
        e.preventDefault();
        e.returnValue = '';
    }
});