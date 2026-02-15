// Sample data for leaderboard demonstration
const sampleUsers = [
    {
        id: 'user_001',
        name: 'Rajesh Kumar',
        company: 'Green Tech Industries',
        industry: 'textile',
        credits: 45.8,
        reduction: 45.8,
        records: 12
    },
    {
        id: 'user_002',
        name: 'Priya Sharma',
        company: 'EcoSteel Manufacturing',
        industry: 'steel',
        credits: 38.2,
        reduction: 38.2,
        records: 8
    },
    {
        id: 'user_003',
        name: 'Amit Patel',
        company: 'Sustainable Solutions Ltd',
        industry: 'other',
        credits: 32.5,
        reduction: 32.5,
        records: 15
    },
    {
        id: 'user_004',
        name: 'Sneha Reddy',
        company: 'Carbon Neutral Corp',
        industry: 'textile',
        credits: 28.9,
        reduction: 28.9,
        records: 9
    },
    {
        id: 'user_005',
        name: 'Vikram Singh',
        company: 'Clean Energy Systems',
        industry: 'steel',
        credits: 25.3,
        reduction: 25.3,
        records: 11
    },
    {
        id: 'user_006',
        name: 'Anita Gupta',
        company: 'Eco Textiles Pvt Ltd',
        industry: 'textile',
        credits: 22.7,
        reduction: 22.7,
        records: 7
    },
    {
        id: 'user_007',
        name: 'Rohit Mehta',
        company: 'Green Manufacturing',
        industry: 'other',
        credits: 19.4,
        reduction: 19.4,
        records: 6
    },
    {
        id: 'user_008',
        name: 'Kavya Nair',
        company: 'Sustainable Industries',
        industry: 'steel',
        credits: 16.8,
        reduction: 16.8,
        records: 5
    },
    {
        id: 'user_009',
        name: 'Arjun Joshi',
        company: 'Carbon Solutions Inc',
        industry: 'textile',
        credits: 14.2,
        reduction: 14.2,
        records: 4
    },
    {
        id: 'user_010',
        name: 'Deepika Rao',
        company: 'Eco-Friendly Systems',
        industry: 'other',
        credits: 11.6,
        reduction: 11.6,
        records: 3
    }
];

async function addSampleData() {
    if (!currentUser) {
        console.log('User not logged in, cannot add sample data');
        return;
    }
    
    try {
        console.log('Adding sample leaderboard data...');
        
        for (const user of sampleUsers) {
            // Add to public profiles
            await db.collection('public_profiles').doc(user.id).set({
                name: user.name,
                company: user.company,
                joinedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Add to users collection
            await db.collection('users').doc(user.id).set({
                name: user.name,
                email: `${user.id}@example.com`,
                company: user.company,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastCreditReset: new Date().getFullYear(),
                isPublic: true
            });
            
            // Add sample emission records
            for (let i = 0; i < user.records; i++) {
                const recordDate = new Date();
                recordDate.setDate(recordDate.getDate() - (i * 7)); // Weekly records
                
                await db.collection('users')
                    .doc(user.id)
                    .collection('emissions')
                    .add({
                        industry: user.industry.charAt(0).toUpperCase() + user.industry.slice(1),
                        total_co2: (Math.random() * 5000 + 2000).toFixed(2), // Random CO2 in kg
                        carbon_intensity: (Math.random() * 10 + 2).toFixed(2),
                        risk_score: Math.floor(Math.random() * 100),
                        sustainability_score: Math.floor(Math.random() * 40 + 60),
                        baseline_emissions: user.industry === 'textile' ? 8.0 : user.industry === 'steel' ? 12.0 : 6.0,
                        emission_reduction: (user.credits / user.records).toFixed(2),
                        carbon_credits: user.credits / user.records,
                        breakdown: {
                            'Base Emissions': (Math.random() * 3000 + 1000).toFixed(2),
                            'Efficiency Bonus': (Math.random() * 500).toFixed(2)
                        },
                        timestamp: firebase.firestore.Timestamp.fromDate(recordDate)
                    });
            }
        }
        
        // Add sample marketplace listings
        const marketplaceListings = [
            {
                sellerId: 'user_001',
                credits: 5.5,
                pricePerCredit: 1200,
                industry: 'Textile',
                description: 'High-quality textile industry credits from verified emissions reduction'
            },
            {
                sellerId: 'user_002',
                credits: 8.0,
                pricePerCredit: 1500,
                industry: 'Steel',
                description: 'Premium steel industry credits with excellent sustainability score'
            },
            {
                sellerId: 'user_003',
                credits: 3.2,
                pricePerCredit: 900,
                industry: 'Other',
                description: 'Affordable credits from sustainable manufacturing processes'
            },
            {
                sellerId: 'user_004',
                credits: 6.8,
                pricePerCredit: 1100,
                industry: 'Textile',
                description: 'Eco-friendly textile credits with carbon neutral certification'
            },
            {
                sellerId: 'user_005',
                credits: 4.5,
                pricePerCredit: 1800,
                industry: 'Steel',
                description: 'Premium steel credits from clean energy systems'
            },
            {
                sellerId: 'user_006',
                credits: 7.2,
                pricePerCredit: 1000,
                industry: 'Textile',
                description: 'Bulk textile credits available at competitive prices'
            }
        ];
        
        console.log('Adding sample marketplace listings...');
        
        for (const listing of marketplaceListings) {
            await db.collection('marketplace').add({
                ...listing,
                status: 'active',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        console.log('✅ Sample data and marketplace listings added successfully!');
        alert('✅ Sample leaderboard data and marketplace listings have been added! Refresh the marketplace to see available credits.');
        
    } catch (error) {
        console.error('Error adding sample data:', error);
        alert('Error adding sample data. Please try again.');
    }
}

// Add button to dashboard for adding sample data (for demo purposes)
function addSampleDataButton() {
    // Sample data button functionality removed
    return;
}

// Auto-add button when page loads
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        // Sample data button removed - no longer needed
    });
}