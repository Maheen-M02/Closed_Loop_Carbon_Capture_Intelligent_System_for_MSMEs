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

// UI Elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const showSignupBtn = document.getElementById('show-signup');
const showLoginBtn = document.getElementById('show-login');
const errorMessage = document.getElementById('error-message');

// Switch between login and signup
showSignupBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
    errorMessage.style.display = 'none';
});

showLoginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
    errorMessage.style.display = 'none';
});

// Login
document.getElementById('login').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        await auth.signInWithEmailAndPassword(email, password);
        showSuccess('Login successful! Redirecting...');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } catch (error) {
        showError(getErrorMessage(error.code));
    }
});

// Signup
document.getElementById('signup').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const company = document.getElementById('signup-company').value;
    
    if (password.length < 6) {
        showError('Password must be at least 6 characters long');
        return;
    }
    
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Update profile
        await user.updateProfile({
            displayName: name
        });
        
        // Store additional user data in Firestore
        await db.collection('users').doc(user.uid).set({
            name: name,
            email: email,
            company: company,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastCreditReset: new Date().getFullYear(),
            isPublic: true // Allow user to appear in leaderboard
        });
        
        // Create public profile for leaderboard
        await db.collection('public_profiles').doc(user.uid).set({
            name: name,
            company: company,
            joinedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showSuccess('Account created successfully! Redirecting...');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } catch (error) {
        showError(getErrorMessage(error.code));
    }
});

// Google Sign In
document.getElementById('google-signin').addEventListener('click', async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    try {
        const result = await auth.signInWithPopup(provider);
        const user = result.user;
        
        // Check if user document exists, if not create it
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (!userDoc.exists) {
            await db.collection('users').doc(user.uid).set({
                name: user.displayName,
                email: user.email,
                company: '',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastCreditReset: new Date().getFullYear(),
                isPublic: true
            });
            
            // Create public profile
            await db.collection('public_profiles').doc(user.uid).set({
                name: user.displayName,
                company: '',
                joinedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        showSuccess('Login successful! Redirecting...');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } catch (error) {
        showError(getErrorMessage(error.code));
    }
});

// Check if user is already logged in
auth.onAuthStateChanged((user) => {
    if (user && window.location.pathname.includes('login.html')) {
        window.location.href = 'dashboard.html';
    }
});

// Helper functions
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    errorMessage.className = 'error-message';
}

function showSuccess(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    errorMessage.className = 'success-message';
}

function getErrorMessage(errorCode) {
    switch (errorCode) {
        case 'auth/email-already-in-use':
            return 'This email is already registered. Please login instead.';
        case 'auth/invalid-email':
            return 'Invalid email address.';
        case 'auth/weak-password':
            return 'Password is too weak. Use at least 6 characters.';
        case 'auth/user-not-found':
            return 'No account found with this email.';
        case 'auth/wrong-password':
            return 'Incorrect password.';
        case 'auth/popup-closed-by-user':
            return 'Sign-in popup was closed. Please try again.';
        default:
            return 'An error occurred. Please try again.';
    }
}
