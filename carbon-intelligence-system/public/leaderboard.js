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
let leaderboardData = [];

// Check authentication status
auth.onAuthStateChanged(async (user) => {
    if (user) {
        currentUser = user;
        const userName = user.displayName || user.email.split('@')[0];
        document.getElementById('user-name').textContent = `Hello, ${userName}`;
        
        await loadLeaderboard();
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

// Filter event listeners
document.getElementById('refresh-leaderboard').addEventListener('click', loadLeaderboard);
document.getElementById('time-filter').addEventListener('change', loadLeaderboard);
document.getElementById('industry-filter').addEventListener('change', loadLeaderboard);

async function loadLeaderboard() {
    const loadingDiv = document.getElementById('leaderboard-loading');
    const contentDiv = document.getElementById('leaderboard-content');
    
    loadingDiv.style.display = 'block';
    contentDiv.style.display = 'none';
    
    try {
        const timeFilter = document.getElementById('time-filter').value;
        const industryFilter = document.getElementById('industry-filter').value;
        
        // Get all users
        const usersSnapshot = await db.collection('users').get();
        const userProfiles = {};
        
        usersSnapshot.forEach(doc => {
            userProfiles[doc.id] = doc.data();
        });
        
        // Calculate leaderboard data
        const leaderboard = [];
        
        console.log('Processing', Object.keys(userProfiles).length, 'users for leaderboard');
        
        for (const userId of Object.keys(userProfiles)) {
            const userCredits = await calculateUserCredits(userId, timeFilter, industryFilter);
            
            // Include all users, even with 0 credits, for demo purposes
            leaderboard.push({
                userId: userId,
                name: userProfiles[userId].name || 'Anonymous User',
                company: userProfiles[userId].company || '',
                totalCredits: userCredits.totalCredits,
                totalReduction: userCredits.totalReduction,
                industry: userCredits.primaryIndustry,
                recordCount: userCredits.recordCount
            });
            
            console.log(`User ${userProfiles[userId].name}: ${userCredits.totalCredits} credits`);
        }
        
        // Sort by credits (descending)
        leaderboard.sort((a, b) => b.totalCredits - a.totalCredits);
        
        // Store for global access
        leaderboardData = leaderboard;
        
        // Display leaderboard
        displayLeaderboard(leaderboard);
        displayUserRanking(leaderboard);
        displayGlobalStats(leaderboard);
        
        loadingDiv.style.display = 'none';
        contentDiv.style.display = 'block';
        
    } catch (error) {
        console.error('Error loading leaderboard:', error);
        loadingDiv.innerHTML = '<p style="color: #e74c3c;">Error loading leaderboard. Please try again.</p>';
    }
}

async function calculateUserCredits(userId, timeFilter, industryFilter) {
    try {
        let query = db.collection('users').doc(userId).collection('emissions');
        
        // Apply time filter
        if (timeFilter === 'current-year') {
            const currentYear = new Date().getFullYear();
            const yearStart = new Date(currentYear, 0, 1);
            query = query.where('timestamp', '>=', yearStart);
        } else if (timeFilter === 'last-month') {
            const monthAgo = new Date();
            monthAgo.setDate(monthAgo.getDate() - 30);
            query = query.where('timestamp', '>=', monthAgo);
        }
        
        const snapshot = await query.get();
        
        let totalCredits = 0;
        let totalReduction = 0;
        let industryCount = {};
        let recordCount = 0;
        
        console.log(`User ${userId} has ${snapshot.size} emission records`);
        
        snapshot.forEach(doc => {
            const data = doc.data();
            const industry = (data.industry || 'other').toLowerCase().replace(/\s*\(.*?\)\s*/g, '');
            
            // Apply industry filter
            if (industryFilter !== 'all' && industry !== industryFilter) {
                return;
            }
            
            const credits = parseFloat(data.carbon_credits) || 0;
            const reduction = parseFloat(data.emission_reduction) || 0;
            
            console.log(`  Record: ${credits} credits, ${reduction} reduction`);
            
            totalCredits += credits;
            totalReduction += reduction;
            recordCount++;
            
            industryCount[industry] = (industryCount[industry] || 0) + 1;
        });
        
        // Find primary industry
        let primaryIndustry = 'other';
        let maxCount = 0;
        for (const [industry, count] of Object.entries(industryCount)) {
            if (count > maxCount) {
                maxCount = count;
                primaryIndustry = industry;
            }
        }
        
        console.log(`User ${userId} total: ${totalCredits} credits`);
        
        return {
            totalCredits,
            totalReduction,
            primaryIndustry: primaryIndustry.charAt(0).toUpperCase() + primaryIndustry.slice(1),
            recordCount
        };
        
    } catch (error) {
        console.error('Error calculating user credits:', error);
        return { totalCredits: 0, totalReduction: 0, primaryIndustry: 'Other', recordCount: 0 };
    }
}

function displayLeaderboard(leaderboard) {
    // Display podium (top 3)
    const podiumPlaces = ['first-place', 'second-place', 'third-place'];
    
    for (let i = 0; i < 3; i++) {
        const placeElement = document.getElementById(podiumPlaces[i]);
        if (leaderboard[i]) {
            const user = leaderboard[i];
            placeElement.querySelector('.podium-name').textContent = user.name;
            placeElement.querySelector('.podium-credits').textContent = `${user.totalCredits.toFixed(2)} Credits`;
        } else {
            placeElement.querySelector('.podium-name').textContent = 'No Data';
            placeElement.querySelector('.podium-credits').textContent = '0 Credits';
        }
    }
    
    // Display full leaderboard table
    const listDiv = document.getElementById('leaderboard-list');
    listDiv.innerHTML = '';
    
    leaderboard.forEach((user, index) => {
        const rank = index + 1;
        const isCurrentUser = user.userId === currentUser.uid;
        
        const rowDiv = document.createElement('div');
        rowDiv.className = `leaderboard-row ${isCurrentUser ? 'current-user' : ''}`;
        
        rowDiv.innerHTML = `
            <div class="rank-badge ${rank <= 3 ? 'top-3' : ''}">#${rank}</div>
            <div class="user-name">
                ${user.name}${isCurrentUser ? ' (You)' : ''}
                ${user.company ? `<br><small style="opacity: 0.7;">${user.company}</small>` : ''}
            </div>
            <div class="industry-tag">${user.industry}</div>
            <div class="credits-value">${user.totalCredits.toFixed(2)}</div>
            <div class="co2-value">${user.totalReduction.toFixed(2)} tons</div>
        `;
        
        listDiv.appendChild(rowDiv);
    });
}

function displayUserRanking(leaderboard) {
    const userRankSection = document.getElementById('user-ranking-section');
    const currentUserIndex = leaderboard.findIndex(user => user.userId === currentUser.uid);
    
    if (currentUserIndex === -1) {
        userRankSection.style.display = 'none';
        return;
    }
    
    const userRank = currentUserIndex + 1;
    const userCredits = leaderboard[currentUserIndex].totalCredits;
    const leaderCredits = leaderboard[0] ? leaderboard[0].totalCredits : 0;
    const creditsBehind = Math.max(0, leaderCredits - userCredits);
    const percentile = Math.round(((leaderboard.length - currentUserIndex) / leaderboard.length) * 100);
    
    document.getElementById('user-rank').textContent = `#${userRank}`;
    document.getElementById('user-credits').textContent = userCredits.toFixed(2);
    document.getElementById('credits-behind').textContent = creditsBehind.toFixed(2);
    document.getElementById('user-percentile').textContent = `${percentile}%`;
    
    userRankSection.style.display = 'block';
}

function displayGlobalStats(leaderboard) {
    const totalUsers = leaderboard.length;
    const totalCredits = leaderboard.reduce((sum, user) => sum + user.totalCredits, 0);
    const totalCO2Reduced = leaderboard.reduce((sum, user) => sum + user.totalReduction, 0);
    const avgCredits = totalUsers > 0 ? totalCredits / totalUsers : 0;
    
    document.getElementById('total-users').textContent = totalUsers.toLocaleString();
    document.getElementById('total-credits-global').textContent = totalCredits.toFixed(0);
    document.getElementById('total-co2-reduced').textContent = `${totalCO2Reduced.toFixed(1)} tons`;
    document.getElementById('avg-credits').textContent = avgCredits.toFixed(1);
}