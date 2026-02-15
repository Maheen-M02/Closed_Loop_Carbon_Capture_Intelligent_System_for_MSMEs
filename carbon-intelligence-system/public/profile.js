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
        
        // Initialize blockchain
        await initializeBlockchain(user.uid);
        
        await loadUserProfile(user);
        await loadEmissionHistory(user.uid);
        await calculateCarbonCredits(user.uid);
        await displayBlockchainStatus(user.uid);
        checkAchievements(user.uid);
        
        // Update current year display
        document.getElementById('current-year').textContent = new Date().getFullYear();
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

async function loadUserProfile(user) {
    try {
        const userDoc = await db.collection('users').doc(user.uid).get();
        
        if (userDoc.exists) {
            const userData = userDoc.data();
            document.getElementById('profile-name').textContent = userData.name || user.displayName || 'N/A';
            document.getElementById('profile-email').textContent = user.email;
            document.getElementById('profile-company').textContent = userData.company || 'Not specified';
            
            if (userData.createdAt) {
                const joinDate = userData.createdAt.toDate();
                document.getElementById('profile-joined').textContent = joinDate.toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            }
            
            // Set leaderboard visibility
            const isPublic = userData.isPublic !== false; // Default to true
            document.getElementById('leaderboard-visibility').checked = isPublic;
            
            // Add event listener for privacy toggle
            document.getElementById('leaderboard-visibility').addEventListener('change', async (e) => {
                try {
                    await db.collection('users').doc(user.uid).update({
                        isPublic: e.target.checked
                    });
                    
                    if (e.target.checked) {
                        // Create/update public profile
                        await db.collection('public_profiles').doc(user.uid).set({
                            name: userData.name,
                            company: userData.company || '',
                            joinedAt: userData.createdAt
                        });
                    } else {
                        // Remove from public profiles
                        await db.collection('public_profiles').doc(user.uid).delete();
                    }
                    
                    alert(e.target.checked ? 
                        '✅ You will now appear on the leaderboard!' : 
                        '🔒 You have been removed from the leaderboard.');
                } catch (error) {
                    console.error('Error updating privacy setting:', error);
                    alert('Error updating privacy setting. Please try again.');
                    e.target.checked = !e.target.checked; // Revert checkbox
                }
            });
            
            // Check for annual reset notification
            await checkAnnualReset(user.uid, userData);
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

async function checkAnnualReset(userId, userData) {
    try {
        const currentYear = new Date().getFullYear();
        const lastResetYear = userData.lastCreditReset || 0;
        
        if (lastResetYear < currentYear) {
            // Show reset notification
            const resetNotification = document.createElement('div');
            resetNotification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
                color: white;
                padding: 20px;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(231, 76, 60, 0.3);
                z-index: 1000;
                max-width: 350px;
                animation: slideInRight 0.5s ease;
            `;
            
            resetNotification.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                    <div style="font-size: 2rem;">🔄</div>
                    <h4 style="margin: 0;">Carbon Credits Reset!</h4>
                </div>
                <p style="margin: 0; line-height: 1.4; font-size: 0.9rem;">
                    Your ${currentYear} carbon credit score has been reset to 0. 
                    Start calculating emissions to earn new credits for this year!
                </p>
                <button onclick="this.parentElement.remove()" style="
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    padding: 8px 15px;
                    border-radius: 6px;
                    margin-top: 10px;
                    cursor: pointer;
                    font-size: 0.85rem;
                ">Dismiss</button>
            `;
            
            document.body.appendChild(resetNotification);
            
            // Update last reset year in database
            await db.collection('users').doc(userId).update({
                lastCreditReset: currentYear
            });
            
            // Auto-remove notification after 10 seconds
            setTimeout(() => {
                if (resetNotification.parentElement) {
                    resetNotification.remove();
                }
            }, 10000);
        }
    } catch (error) {
        console.error('Error checking annual reset:', error);
    }
}

async function loadEmissionHistory(userId) {
    try {
        const emissionsSnapshot = await db.collection('users')
            .doc(userId)
            .collection('emissions')
            .orderBy('timestamp', 'desc')
            .limit(10)
            .get();
        
        const historyDiv = document.getElementById('emission-history');
        
        if (emissionsSnapshot.empty) {
            historyDiv.innerHTML = '<p style="text-align: center; color: #4a7c59;">No emission data recorded yet. Start calculating emissions on the dashboard!</p>';
            return;
        }
        
        historyDiv.innerHTML = '';
        
        emissionsSnapshot.forEach(doc => {
            const data = doc.data();
            const date = data.timestamp.toDate();
            
            const recordDiv = document.createElement('div');
            recordDiv.className = 'emission-record';
            recordDiv.innerHTML = `
                <div class="record-date">
                    ${date.toLocaleDateString('en-IN')}<br>
                    <small>${date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</small>
                </div>
                <div class="record-details">
                    <div class="record-item">
                        <label>Industry</label>
                        <span>${data.industry || 'N/A'}</span>
                    </div>
                    <div class="record-item">
                        <label>Total CO₂</label>
                        <span>${data.total_co2} kg</span>
                    </div>
                    <div class="record-item">
                        <label>Carbon Intensity</label>
                        <span>${data.carbon_intensity} kg/unit</span>
                    </div>
                    <div class="record-item">
                        <label>Sustainability Score</label>
                        <span>${data.sustainability_score || 'N/A'}</span>
                    </div>
                </div>
                <div class="record-credits">
                    ${data.carbon_credits ? data.carbon_credits.toFixed(2) : '0'} Credits
                </div>
            `;
            
            historyDiv.appendChild(recordDiv);
        });
    } catch (error) {
        console.error('Error loading emission history:', error);
    }
}

async function calculateCarbonCredits(userId) {
    try {
        const currentYear = new Date().getFullYear();
        const yearStart = new Date(currentYear, 0, 1); // January 1st of current year
        
        // Get all emissions for current year
        const currentYearSnapshot = await db.collection('users')
            .doc(userId)
            .collection('emissions')
            .where('timestamp', '>=', yearStart)
            .orderBy('timestamp', 'desc')
            .get();
        
        // Get all-time emissions for historical data
        const allTimeSnapshot = await db.collection('users')
            .doc(userId)
            .collection('emissions')
            .orderBy('timestamp', 'desc')
            .get();
        
        if (allTimeSnapshot.empty) {
            return;
        }
        
        // Calculate current year credits
        let currentYearCredits = 0;
        let currentYearReduction = 0;
        let currentYearAvgScore = 0;
        let currentYearCount = 0;
        
        // Calculate all-time totals
        let allTimeCredits = 0;
        let allTimeReduction = 0;
        let allTimeAvgScore = 0;
        let allTimeCount = 0;
        
        // Baseline emissions (industry average in tons)
        const baselineEmissions = {
            'textile': 8.0,
            'steel': 12.0,
            'other': 6.0
        };
        
        // Process current year data
        currentYearSnapshot.forEach(doc => {
            const data = doc.data();
            const industry = (data.industry || 'other').toLowerCase().replace(/\s*\(.*?\)\s*/g, '');
            const currentEmissions = parseFloat(data.total_co2) / 1000;
            const baseline = baselineEmissions[industry] || baselineEmissions['other'];
            
            const reduction = Math.max(0, baseline - currentEmissions);
            currentYearReduction += reduction;
            currentYearCredits += reduction;
            
            if (data.sustainability_score) {
                currentYearAvgScore += parseFloat(data.sustainability_score);
                currentYearCount++;
            }
        });
        
        // Process all-time data
        allTimeSnapshot.forEach(doc => {
            const data = doc.data();
            const industry = (data.industry || 'other').toLowerCase().replace(/\s*\(.*?\)\s*/g, '');
            const currentEmissions = parseFloat(data.total_co2) / 1000;
            const baseline = baselineEmissions[industry] || baselineEmissions['other'];
            
            const reduction = Math.max(0, baseline - currentEmissions);
            allTimeReduction += reduction;
            allTimeCredits += reduction;
            
            if (data.sustainability_score) {
                allTimeAvgScore += parseFloat(data.sustainability_score);
                allTimeCount++;
            }
        });
        
        currentYearAvgScore = currentYearCount > 0 ? currentYearAvgScore / currentYearCount : 0;
        allTimeAvgScore = allTimeCount > 0 ? allTimeAvgScore / allTimeCount : 0;
        
        // Update UI with current year data (primary display)
        document.getElementById('total-credits').textContent = currentYearCredits.toFixed(2);
        document.getElementById('total-reduction').textContent = `${currentYearReduction.toFixed(2)} tons CO₂`;
        
        // Calculate value (₹700-₹2000 per credit)
        const minValue = (currentYearCredits * 700).toFixed(0);
        const maxValue = (currentYearCredits * 2000).toFixed(0);
        document.getElementById('credit-value').textContent = `₹${minValue} - ₹${maxValue}`;
        
        // Sustainability rating
        let rating = 'Not Rated';
        if (currentYearAvgScore >= 80) rating = 'Excellent ⭐⭐⭐⭐⭐';
        else if (currentYearAvgScore >= 60) rating = 'Good ⭐⭐⭐⭐';
        else if (currentYearAvgScore >= 40) rating = 'Fair ⭐⭐⭐';
        else if (currentYearAvgScore > 0) rating = 'Needs Improvement ⭐⭐';
        
        document.getElementById('sustainability-rating').textContent = rating;
        
        // Display breakdown with annual reset info
        displayCreditBreakdown(
            currentYearCredits, 
            currentYearReduction, 
            minValue, 
            maxValue, 
            currentYearSnapshot.size,
            allTimeCredits,
            allTimeReduction,
            allTimeSnapshot.size,
            currentYear
        );
        
    } catch (error) {
        console.error('Error calculating carbon credits:', error);
    }
}

function displayCreditBreakdown(currentCredits, currentReduction, minValue, maxValue, currentRecords, allTimeCredits, allTimeReduction, allTimeRecords, currentYear) {
    const breakdownDiv = document.getElementById('credit-breakdown');
    
    breakdownDiv.innerHTML = `
        <div style="background: linear-gradient(135deg, var(--accent-green) 0%, #5ee89d 100%); padding: 20px; border-radius: 12px; margin-bottom: 20px; color: var(--dark-green);">
            <h3 style="margin-bottom: 15px; text-align: center;">📅 ${currentYear} Carbon Credits (Current Year)</h3>
            <p style="text-align: center; font-size: 0.9rem; opacity: 0.8;">
                Carbon credits reset annually on January 1st for compliance with international standards
            </p>
        </div>
        
        <div class="credit-breakdown-grid">
            <div class="breakdown-card">
                <h4>${currentYear} Carbon Credits</h4>
                <div class="value">${currentCredits.toFixed(2)}</div>
                <div class="unit">Credits This Year</div>
            </div>
            <div class="breakdown-card">
                <h4>${currentYear} CO₂ Reduction</h4>
                <div class="value">${currentReduction.toFixed(2)}</div>
                <div class="unit">Tons Reduced</div>
            </div>
            <div class="breakdown-card">
                <h4>Current Year Value (Min)</h4>
                <div class="value">₹${minValue}</div>
                <div class="unit">@ ₹700/credit</div>
            </div>
            <div class="breakdown-card">
                <h4>Current Year Value (Max)</h4>
                <div class="value">₹${maxValue}</div>
                <div class="unit">@ ₹2000/credit</div>
            </div>
        </div>
        
        <div style="background: var(--light-green); padding: 20px; border-radius: 12px; margin: 20px 0;">
            <h4 style="color: var(--dark-green); margin-bottom: 15px;">📊 Historical Performance</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                <div style="text-align: center;">
                    <p style="color: #4a7c59; font-size: 0.85rem; margin-bottom: 5px;">All-Time Credits</p>
                    <p style="color: var(--dark-green); font-size: 1.5rem; font-weight: 700;">${allTimeCredits.toFixed(2)}</p>
                </div>
                <div style="text-align: center;">
                    <p style="color: #4a7c59; font-size: 0.85rem; margin-bottom: 5px;">All-Time Reduction</p>
                    <p style="color: var(--dark-green); font-size: 1.5rem; font-weight: 700;">${allTimeReduction.toFixed(2)} tons</p>
                </div>
                <div style="text-align: center;">
                    <p style="color: #4a7c59; font-size: 0.85rem; margin-bottom: 5px;">Total Records</p>
                    <p style="color: var(--dark-green); font-size: 1.5rem; font-weight: 700;">${allTimeRecords}</p>
                </div>
            </div>
        </div>
        
        <div style="margin-top: 30px; padding: 25px; background: var(--light-green); border-radius: 12px; border-left: 4px solid var(--accent-green);">
            <h3 style="color: var(--dark-green); margin-bottom: 15px;">📊 How Carbon Credits Work</h3>
            <p style="color: #4a7c59; line-height: 1.6; margin-bottom: 10px;">
                <strong>Annual Reset System:</strong> Carbon credits reset every January 1st to align with international carbon accounting standards.
            </p>
            <p style="color: #4a7c59; line-height: 1.6; margin-bottom: 10px;">
                <strong>1 Carbon Credit = 1 ton of CO₂ reduced</strong> compared to industry baselines:
            </p>
            <ul style="color: #4a7c59; line-height: 1.8; margin-left: 20px; margin-bottom: 15px;">
                <li><strong>Textile Industry:</strong> 8 tons CO₂ baseline per cycle</li>
                <li><strong>Steel Industry:</strong> 12 tons CO₂ baseline per cycle</li>
                <li><strong>Other Industries:</strong> 6 tons CO₂ baseline per cycle</li>
            </ul>
            <div style="background: rgba(15, 42, 29, 0.1); padding: 15px; border-radius: 8px; margin-top: 15px;">
                <p style="color: var(--dark-green); font-weight: 600; margin-bottom: 8px;">
                    🎯 ${currentYear} Progress: ${currentCredits.toFixed(2)} credits earned from ${currentRecords} calculations
                </p>
                <p style="color: #4a7c59; font-size: 0.9rem;">
                    Historical Total: ${allTimeCredits.toFixed(2)} credits earned since you started tracking
                </p>
            </div>
        </div>
        
        <div style="background: rgba(231, 76, 60, 0.1); padding: 20px; border-radius: 12px; margin-top: 20px; border-left: 4px solid #e74c3c;">
            <h4 style="color: #e74c3c; margin-bottom: 10px;">⚠️ Important: Annual Reset</h4>
            <p style="color: #c0392b; line-height: 1.6;">
                Your carbon credit score resets to 0 every January 1st. This follows international carbon credit standards 
                where credits are issued annually. Your historical data and achievements remain permanently recorded on the blockchain.
            </p>
        </div>
    `;
}

async function checkAchievements(userId) {
    try {
        const emissionsSnapshot = await db.collection('users')
            .doc(userId)
            .collection('emissions')
            .get();
        
        const achievements = document.querySelectorAll('.achievement-badge');
        
        // First Step - Calculate first emission
        if (emissionsSnapshot.size >= 1) {
            achievements[0].classList.remove('locked');
            achievements[0].classList.add('unlocked');
        }
        
        // Eco Warrior - Earn 10 carbon credits
        let totalCredits = 0;
        emissionsSnapshot.forEach(doc => {
            const data = doc.data();
            totalCredits += data.carbon_credits || 0;
        });
        
        if (totalCredits >= 10) {
            achievements[1].classList.remove('locked');
            achievements[1].classList.add('unlocked');
        }
        
        // Sustainability Champion - Achieve 80+ sustainability score
        let hasHighScore = false;
        emissionsSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.sustainability_score >= 80) {
                hasHighScore = true;
            }
        });
        
        if (hasHighScore) {
            achievements[2].classList.remove('locked');
            achievements[2].classList.add('unlocked');
        }
        
        // Consistent Tracker - Track for 7 days
        if (emissionsSnapshot.size >= 7) {
            achievements[3].classList.remove('locked');
            achievements[3].classList.add('unlocked');
        }
        
    } catch (error) {
        console.error('Error checking achievements:', error);
    }
}

async function displayBlockchainStatus(userId) {
    const statusDiv = document.getElementById('blockchain-status');
    
    try {
        const blockchain = getBlockchainInstance();
        
        if (!blockchain || blockchain.chain.length === 0) {
            statusDiv.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <p style="color: #4a7c59;">No blockchain data yet. Start calculating emissions to create your blockchain!</p>
                </div>
            `;
            return;
        }
        
        const isValid = blockchain.isChainValid();
        const totalBlocks = blockchain.chain.length;
        const totalCredits = blockchain.getTotalCarbonCredits();
        const transactions = blockchain.getTransactionHistory();
        
        statusDiv.innerHTML = `
            <div style="background: ${isValid ? 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)' : 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)'}; padding: 25px; border-radius: 12px; color: white; margin-bottom: 20px;">
                <div style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 15px;">
                    <div style="font-size: 3rem;">${isValid ? '✓' : '✗'}</div>
                    <div>
                        <h3 style="margin-bottom: 5px;">Blockchain Status</h3>
                        <p style="font-size: 1.2rem; font-weight: 700;">${isValid ? 'VERIFIED & SECURE' : 'VERIFICATION FAILED'}</p>
                    </div>
                </div>
                <p style="text-align: center; opacity: 0.9;">
                    ${isValid ? 'All carbon credit records are authentic and tamper-proof' : 'Warning: Blockchain integrity compromised'}
                </p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 20px;">
                <div style="background: var(--light-green); padding: 20px; border-radius: 12px; text-align: center;">
                    <h4 style="color: #4a7c59; font-size: 0.85rem; margin-bottom: 8px;">Total Blocks</h4>
                    <p style="color: var(--dark-green); font-size: 2rem; font-weight: 700;">${totalBlocks}</p>
                </div>
                <div style="background: var(--light-green); padding: 20px; border-radius: 12px; text-align: center;">
                    <h4 style="color: #4a7c59; font-size: 0.85rem; margin-bottom: 8px;">Transactions</h4>
                    <p style="color: var(--dark-green); font-size: 2rem; font-weight: 700;">${transactions.length}</p>
                </div>
                <div style="background: var(--light-green); padding: 20px; border-radius: 12px; text-align: center;">
                    <h4 style="color: #4a7c59; font-size: 0.85rem; margin-bottom: 8px;">Blockchain Credits</h4>
                    <p style="color: var(--dark-green); font-size: 2rem; font-weight: 700;">${totalCredits.toFixed(2)}</p>
                </div>
            </div>
            
            <div style="background: var(--light-green); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                <h4 style="color: var(--dark-green); margin-bottom: 15px;">🔗 Latest Block Information</h4>
                <div style="font-family: monospace; font-size: 0.85rem; color: #4a7c59;">
                    <p style="margin-bottom: 8px;"><strong>Block Hash:</strong><br>${blockchain.getLatestBlock().hash}</p>
                    <p style="margin-bottom: 8px;"><strong>Previous Hash:</strong><br>${blockchain.getLatestBlock().previousHash}</p>
                    <p><strong>Timestamp:</strong> ${new Date(blockchain.getLatestBlock().timestamp).toLocaleString('en-IN')}</p>
                </div>
            </div>
            
            <button onclick="downloadBlockchainCertificate()" class="btn-primary" style="margin-top: 15px;">
                📜 Download Blockchain Certificate
            </button>
            
            <div style="margin-top: 20px; padding: 15px; background: rgba(124, 255, 178, 0.1); border-radius: 10px; border-left: 4px solid var(--accent-green);">
                <strong style="color: var(--dark-green);">🔐 Why Blockchain?</strong>
                <p style="margin-top: 10px; color: #4a7c59; line-height: 1.6;">
                    Your carbon credits are stored on an immutable blockchain ledger. Each transaction is cryptographically secured 
                    and linked to previous transactions, making it impossible to alter or forge records. This ensures complete 
                    transparency and trust in your carbon credit portfolio.
                </p>
            </div>
        `;
        
    } catch (error) {
        console.error('Error displaying blockchain status:', error);
        statusDiv.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #e74c3c;">
                <p>Error loading blockchain data. Please refresh the page.</p>
            </div>
        `;
    }
}

function downloadBlockchainCertificate() {
    const blockchain = getBlockchainInstance();
    if (!blockchain) {
        alert('Blockchain not initialized');
        return;
    }
    
    const certificate = blockchain.exportBlockchainCertificate();
    const certificateText = `
═══════════════════════════════════════════════════════════
        CARBON CREDIT BLOCKCHAIN CERTIFICATE
═══════════════════════════════════════════════════════════

User ID: ${certificate.userId}
Export Date: ${certificate.exportDate}

BLOCKCHAIN SUMMARY
─────────────────────────────────────────────────────────
Total Blocks: ${certificate.totalBlocks}
Total Carbon Credits: ${certificate.totalCarbonCredits.toFixed(2)}
Blockchain Valid: ${certificate.isValid ? 'YES ✓' : 'NO ✗'}

CRYPTOGRAPHIC VERIFICATION
─────────────────────────────────────────────────────────
Genesis Block Hash: ${certificate.genesisBlockHash}
Latest Block Hash: ${certificate.latestBlockHash}

TRANSACTION HISTORY
─────────────────────────────────────────────────────────
${certificate.transactions.map((tx, i) => `
Transaction #${i + 1}
  Industry: ${tx.industry}
  CO₂ Emissions: ${tx.totalCO2} kg
  Carbon Credits: ${tx.carbonCredits.toFixed(2)}
  Timestamp: ${new Date(tx.timestamp).toLocaleString('en-IN')}
  Hash: ${tx.hash}
`).join('\n')}

═══════════════════════════════════════════════════════════
This certificate verifies that all carbon credit transactions
are recorded on an immutable blockchain ledger and have been
cryptographically verified for authenticity.
═══════════════════════════════════════════════════════════
    `;
    
    const blob = new Blob([certificateText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `carbon-credit-certificate-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    alert('✅ Blockchain certificate downloaded successfully!');
}
