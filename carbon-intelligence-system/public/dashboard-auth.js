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

// Check authentication status
auth.onAuthStateChanged(async (user) => {
    if (user) {
        currentUser = user;
        const userName = user.displayName || user.email.split('@')[0];
        document.getElementById('user-name').textContent = `Hello, ${userName}`;
        
        // Initialize blockchain for this user
        await initializeBlockchain(user.uid);
        console.log('Blockchain initialized for user');
        
        // Load dashboard notifications
        await loadDashboardNotifications();
    } else {
        // No user is signed in, redirect to login
        window.location.href = 'login.html';
    }
});

async function loadDashboardNotifications() {
    try {
        const notificationsSection = document.getElementById('dashboard-notifications');
        const notificationsList = document.getElementById('dashboard-notifications-list');
        
        // Get purchase requests for user's credits
        const requestsSnapshot = await db.collection('credit_requests')
            .where('sellerId', '==', currentUser.uid)
            .where('status', '==', 'pending')
            .limit(3)
            .get();
        
        if (requestsSnapshot.empty) {
            notificationsSection.style.display = 'none';
            return;
        }
        
        notificationsList.innerHTML = '';
        
        for (const doc of requestsSnapshot.docs) {
            const request = doc.data();
            
            // Get buyer info
            const buyerDoc = await db.collection('users').doc(request.buyerId).get();
            const buyerName = buyerDoc.exists ? buyerDoc.data().name : 'Anonymous';
            
            const notificationDiv = document.createElement('div');
            notificationDiv.style.cssText = `
                background: var(--light-green);
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 10px;
                border-left: 4px solid #f39c12;
            `;
            
            notificationDiv.innerHTML = `
                <div style="display: flex; justify-content: between; align-items: center;">
                    <div>
                        <strong style="color: var(--dark-green);">💰 Credit Purchase Request</strong>
                        <p style="margin: 5px 0; color: #4a7c59; font-size: 0.9rem;">
                            ${buyerName} wants to buy ${request.credits} credits at ₹${request.pricePerCredit} each
                        </p>
                    </div>
                    <a href="marketplace.html" class="btn-secondary" style="margin-left: 15px; text-decoration: none; font-size: 0.85rem;">
                        View Details
                    </a>
                </div>
            `;
            
            notificationsList.appendChild(notificationDiv);
        }
        
        notificationsSection.style.display = 'block';
        
    } catch (error) {
        console.error('Error loading dashboard notifications:', error);
    }
}

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
