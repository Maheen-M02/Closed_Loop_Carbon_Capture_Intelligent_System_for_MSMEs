// Industry selection
const industryBtns = document.querySelectorAll('.industry-btn');
const forms = document.querySelectorAll('.input-form');
let selectedIndustry = 'textile';
let uploadedFileData = null;

industryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        industryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedIndustry = btn.dataset.industry;
        
        forms.forEach(form => form.classList.remove('active'));
        document.getElementById(`${selectedIndustry}-form`).classList.add('active');
    });
});

// File upload handling
document.getElementById('upload-btn').addEventListener('click', () => {
    document.getElementById('file-input').click();
});

document.getElementById('file-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        document.getElementById('file-name').textContent = file.name;
        document.getElementById('process-file-btn').style.display = 'block';
        uploadedFileData = file;
    }
});

document.getElementById('process-file-btn').addEventListener('click', () => {
    if (uploadedFileData) {
        processFile(uploadedFileData);
    }
});

function processFile(file) {
    const fileName = file.name.toLowerCase();
    
    if (fileName.endsWith('.csv')) {
        processCSV(file);
    } else if (fileName.endsWith('.json')) {
        processJSON(file);
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        processExcel(file);
    } else if (fileName.endsWith('.pkl')) {
        alert('⚠️ PKL files require Python backend processing. Please convert to CSV, JSON, or Excel format first.\n\nYou can use the steel_data_upload.py script to convert and upload your data.');
    } else {
        alert('Unsupported file format. Please upload CSV, JSON, or Excel files.');
    }
}

function processCSV(file) {
    Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: function(results) {
            const data = results.data[0]; // Process first row
            if (data) {
                detectAndCalculate(data);
            }
        },
        error: function(error) {
            alert('Error reading CSV file: ' + error.message);
        }
    });
}

function processJSON(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            const firstRecord = Array.isArray(data) ? data[0] : data;
            detectAndCalculate(firstRecord);
        } catch (error) {
            alert('Error parsing JSON file: ' + error.message);
        }
    };
    reader.readAsText(file);
}

function processExcel(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet);
            if (jsonData.length > 0) {
                detectAndCalculate(jsonData[0]);
            }
        } catch (error) {
            alert('Error reading Excel file: ' + error.message);
        }
    };
    reader.readAsArrayBuffer(file);
}

function detectAndCalculate(data) {
    // Auto-detect industry type based on data fields
    const fields = Object.keys(data).map(k => k.toLowerCase());
    
    let detectedIndustry = 'other';
    let result;
    
    // Check for steel industry fields
    if (fields.some(f => f.includes('usage_kwh') || f.includes('power_factor') || f.includes('lagging'))) {
        detectedIndustry = 'steel';
        result = calculateSteelFromFile(data);
    }
    // Check for textile industry fields
    else if (fields.some(f => f.includes('electricity') || f.includes('diesel') || f.includes('coal') || f.includes('lpg'))) {
        detectedIndustry = 'textile';
        result = calculateTextileFromFile(data);
    }
    // Default to other
    else {
        result = calculateOtherFromFile(data);
    }
    
    // Update UI to show detected industry
    industryBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.industry === detectedIndustry) {
            btn.classList.add('active');
        }
    });
    selectedIndustry = detectedIndustry;
    
    displayResults(result);
}

function calculateTextileFromFile(data) {
    const electricity = parseFloat(data.electricity_kwh || data.Electricity_kWh || data.electricity || 0);
    const diesel = parseFloat(data.diesel_liters || data.Diesel_Liters || data.diesel || 0);
    const coal = parseFloat(data.coal_kg || data.Coal_kg || data.coal || 0);
    const lpg = parseFloat(data.lpg_kg || data.LPG_kg || data.lpg || 0);
    const units = parseFloat(data.production_units || data.Production_Units || data.units || 1);
    
    const ELECTRICITY_FACTOR = 0.82;
    const DIESEL_FACTOR = 2.68;
    const COAL_FACTOR = 2.42;
    const LPG_FACTOR = 3.00;
    
    const electricity_co2 = electricity * ELECTRICITY_FACTOR;
    const diesel_co2 = diesel * DIESEL_FACTOR;
    const coal_co2 = coal * COAL_FACTOR;
    const lpg_co2 = lpg * LPG_FACTOR;
    
    const total_co2 = electricity_co2 + diesel_co2 + coal_co2 + lpg_co2;
    const carbon_intensity = total_co2 / units;
    
    let risk_score = 0;
    if (carbon_intensity > 5) risk_score += 30;
    if (coal_co2 > 500) risk_score += 20;
    if (diesel_co2 > 300) risk_score += 15;
    if (electricity_co2 > 1000) risk_score += 20;
    
    return {
        industry: 'Textile (Auto-detected)',
        total_co2: total_co2.toFixed(2),
        carbon_intensity: carbon_intensity.toFixed(2),
        risk_score,
        breakdown: {
            'Electricity': electricity_co2.toFixed(2),
            'Diesel': diesel_co2.toFixed(2),
            'Coal': coal_co2.toFixed(2),
            'LPG': lpg_co2.toFixed(2)
        },
        recommendations: getTextileRecommendations(electricity_co2, diesel_co2, coal_co2, lpg_co2, carbon_intensity)
    };
}

function calculateSteelFromFile(data) {
    const usage = parseFloat(data.Usage_kWh || data.usage_kwh || data.energy || 0);
    const lagging_pf = parseFloat(data.Lagging_Current_Power_Factor || data.lagging_pf || 0.85);
    const leading_pf = parseFloat(data.Leading_Current_Power_Factor || data.leading_pf || 0.85);
    const change_rate = parseFloat(data.Energy_Change_Rate || data.change_rate || 0);
    const anomaly = data.Anomaly === true || data.anomaly === true || data.Anomaly === 1;
    const units = parseFloat(data.production_units || data.Production_Units || data.units || 1);
    
    const GRID_FACTOR = 0.82;
    
    const base_co2 = usage * GRID_FACTOR;
    const avg_pf = (lagging_pf + leading_pf) / 2;
    
    let pf_penalty = 0;
    if (avg_pf < 0.9) {
        pf_penalty = (0.9 - avg_pf) * 0.05 * base_co2;
    }
    
    let spike_penalty = 0;
    if (change_rate > 0.1) {
        spike_penalty = 0.03 * base_co2;
    }
    
    let anomaly_penalty = 0;
    if (anomaly) {
        anomaly_penalty = 0.05 * base_co2;
    }
    
    const total_co2 = base_co2 + pf_penalty + spike_penalty + anomaly_penalty;
    const carbon_intensity = total_co2 / units;
    
    let risk_score = 0;
    if (avg_pf < 0.85) risk_score += 40;
    if (anomaly) risk_score += 30;
    if (change_rate > 0.1) risk_score += 20;
    if (carbon_intensity > 10) risk_score += 10;
    
    return {
        industry: 'Steel (Auto-detected)',
        total_co2: total_co2.toFixed(2),
        carbon_intensity: carbon_intensity.toFixed(2),
        risk_score,
        breakdown: {
            'Base CO2': base_co2.toFixed(2),
            'Power Factor Penalty': pf_penalty.toFixed(2),
            'Energy Spike Penalty': spike_penalty.toFixed(2),
            'Anomaly Penalty': anomaly_penalty.toFixed(2),
            'Avg Power Factor': (avg_pf * 100).toFixed(1) + '%'
        },
        recommendations: getSteelRecommendations(avg_pf, change_rate, anomaly, carbon_intensity)
    };
}

function calculateOtherFromFile(data) {
    // Try to find energy-related fields
    const energy = parseFloat(
        data.energy || data.Energy || data.usage_kwh || data.Usage_kWh || 
        data.electricity_kwh || data.Electricity_kWh || 0
    );
    const factor = 0.82;
    const units = parseFloat(data.production_units || data.Production_Units || data.units || 1);
    
    const total_co2 = energy * factor;
    const carbon_intensity = total_co2 / units;
    
    let risk_score = 0;
    if (carbon_intensity > 8) risk_score += 40;
    if (total_co2 > 5000) risk_score += 30;
    
    return {
        industry: 'Other (Auto-detected)',
        total_co2: total_co2.toFixed(2),
        carbon_intensity: carbon_intensity.toFixed(2),
        risk_score,
        breakdown: {
            'Total Energy': energy.toFixed(2) + ' kWh',
            'Emission Factor': factor.toFixed(2) + ' kg CO2/kWh',
            'Total CO2': total_co2.toFixed(2) + ' kg'
        },
        recommendations: getOtherRecommendations(carbon_intensity, total_co2)
    };
}

// Calculate button
document.getElementById('calculate-btn').addEventListener('click', () => {
    calculateEmissions();
});

// Sustainability Index button
document.getElementById('sustainability-btn').addEventListener('click', () => {
    const sustainabilityDiv = document.getElementById('sustainability-index');
    if (sustainabilityDiv.style.display === 'none') {
        sustainabilityDiv.style.display = 'block';
        document.getElementById('sustainability-btn').textContent = '🌍 Hide Sustainability Index';
        sustainabilityDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
        sustainabilityDiv.style.display = 'none';
        document.getElementById('sustainability-btn').textContent = '🌍 Show Sustainability Index';
    }
});

function calculateEmissions() {
    let result;
    
    if (selectedIndustry === 'textile') {
        result = calculateTextile();
    } else if (selectedIndustry === 'steel') {
        result = calculateSteel();
    } else {
        result = calculateOther();
    }
    
    displayResults(result);
}

function calculateTextile() {
    const electricity = parseFloat(document.getElementById('textile-electricity').value) || 0;
    const diesel = parseFloat(document.getElementById('textile-diesel').value) || 0;
    const coal = parseFloat(document.getElementById('textile-coal').value) || 0;
    const lpg = parseFloat(document.getElementById('textile-lpg').value) || 0;
    const units = parseFloat(document.getElementById('textile-units').value) || 1;
    
    const ELECTRICITY_FACTOR = 0.82;
    const DIESEL_FACTOR = 2.68;
    const COAL_FACTOR = 2.42;
    const LPG_FACTOR = 3.00;
    
    const electricity_co2 = electricity * ELECTRICITY_FACTOR;
    const diesel_co2 = diesel * DIESEL_FACTOR;
    const coal_co2 = coal * COAL_FACTOR;
    const lpg_co2 = lpg * LPG_FACTOR;
    
    const total_co2 = electricity_co2 + diesel_co2 + coal_co2 + lpg_co2;
    const carbon_intensity = total_co2 / units;
    
    let risk_score = 0;
    if (carbon_intensity > 5) risk_score += 30;
    if (coal_co2 > 500) risk_score += 20;
    if (diesel_co2 > 300) risk_score += 15;
    if (electricity_co2 > 1000) risk_score += 20;
    
    return {
        industry: 'Textile',
        total_co2: total_co2.toFixed(2),
        carbon_intensity: carbon_intensity.toFixed(2),
        risk_score,
        breakdown: {
            'Electricity': electricity_co2.toFixed(2),
            'Diesel': diesel_co2.toFixed(2),
            'Coal': coal_co2.toFixed(2),
            'LPG': lpg_co2.toFixed(2)
        },
        recommendations: getTextileRecommendations(electricity_co2, diesel_co2, coal_co2, lpg_co2, carbon_intensity)
    };
}

function calculateSteel() {
    const usage = parseFloat(document.getElementById('steel-usage').value) || 0;
    const lagging_pf = parseFloat(document.getElementById('steel-lagging-pf').value) || 0.85;
    const leading_pf = parseFloat(document.getElementById('steel-leading-pf').value) || 0.85;
    const change_rate = parseFloat(document.getElementById('steel-change-rate').value) || 0;
    const anomaly = document.getElementById('steel-anomaly').checked;
    const units = parseFloat(document.getElementById('steel-units').value) || 1;
    
    const GRID_FACTOR = 0.82;
    
    const base_co2 = usage * GRID_FACTOR;
    const avg_pf = (lagging_pf + leading_pf) / 2;
    
    let pf_penalty = 0;
    if (avg_pf < 0.9) {
        pf_penalty = (0.9 - avg_pf) * 0.05 * base_co2;
    }
    
    let spike_penalty = 0;
    if (change_rate > 0.1) {
        spike_penalty = 0.03 * base_co2;
    }
    
    let anomaly_penalty = 0;
    if (anomaly) {
        anomaly_penalty = 0.05 * base_co2;
    }
    
    const total_co2 = base_co2 + pf_penalty + spike_penalty + anomaly_penalty;
    const carbon_intensity = total_co2 / units;
    
    let risk_score = 0;
    if (avg_pf < 0.85) risk_score += 40;
    if (anomaly) risk_score += 30;
    if (change_rate > 0.1) risk_score += 20;
    if (carbon_intensity > 10) risk_score += 10;
    
    return {
        industry: 'Steel',
        total_co2: total_co2.toFixed(2),
        carbon_intensity: carbon_intensity.toFixed(2),
        risk_score,
        breakdown: {
            'Base CO2': base_co2.toFixed(2),
            'Power Factor Penalty': pf_penalty.toFixed(2),
            'Energy Spike Penalty': spike_penalty.toFixed(2),
            'Anomaly Penalty': anomaly_penalty.toFixed(2),
            'Avg Power Factor': (avg_pf * 100).toFixed(1) + '%'
        },
        recommendations: getSteelRecommendations(avg_pf, change_rate, anomaly, carbon_intensity)
    };
}

function calculateOther() {
    const energy = parseFloat(document.getElementById('other-energy').value) || 0;
    const factor = parseFloat(document.getElementById('other-factor').value) || 0.82;
    const units = parseFloat(document.getElementById('other-units').value) || 1;
    
    const total_co2 = energy * factor;
    const carbon_intensity = total_co2 / units;
    
    let risk_score = 0;
    if (carbon_intensity > 8) risk_score += 40;
    if (total_co2 > 5000) risk_score += 30;
    
    return {
        industry: 'Other',
        total_co2: total_co2.toFixed(2),
        carbon_intensity: carbon_intensity.toFixed(2),
        risk_score,
        breakdown: {
            'Total Energy': energy.toFixed(2) + ' kWh',
            'Emission Factor': factor.toFixed(2) + ' kg CO2/kWh',
            'Total CO2': total_co2.toFixed(2) + ' kg'
        },
        recommendations: getOtherRecommendations(carbon_intensity, total_co2)
    };
}

function getTextileRecommendations(electricity, diesel, coal, lpg, intensity) {
    const recommendations = [];
    
    if (coal > 500) {
        recommendations.push({
            title: '🔥 Reduce Coal Dependency',
            text: 'Coal contributes significantly to emissions. Consider switching to cleaner energy sources like natural gas or renewable energy.'
        });
    }
    
    if (electricity > 1000) {
        recommendations.push({
            title: '⚡ Optimize Electricity Usage',
            text: 'Install energy-efficient machinery, LED lighting, and implement power management systems to reduce electricity consumption.'
        });
    }
    
    if (diesel > 300) {
        recommendations.push({
            title: '🚛 Minimize Diesel Usage',
            text: 'Optimize logistics, use electric vehicles for internal transport, and maintain diesel generators properly.'
        });
    }
    
    if (intensity > 5) {
        recommendations.push({
            title: '📊 High Carbon Intensity',
            text: 'Your carbon intensity is above industry standards. Focus on process optimization and renewable energy adoption.'
        });
    }
    
    recommendations.push({
        title: '🌱 General Improvements',
        text: 'Implement waste heat recovery, upgrade to energy-efficient equipment, and consider renewable energy certificates (RECs).'
    });
    
    return recommendations;
}

function getSteelRecommendations(avg_pf, change_rate, anomaly, intensity) {
    const recommendations = [];
    
    if (avg_pf < 0.85) {
        recommendations.push({
            title: '⚡ Improve Power Factor',
            text: 'Install power factor correction capacitors to improve efficiency and reduce penalties. Target: >0.95'
        });
    }
    
    if (change_rate > 0.1) {
        recommendations.push({
            title: '📈 Stabilize Energy Consumption',
            text: 'High energy fluctuations indicate inefficiency. Implement load balancing and predictive maintenance.'
        });
    }
    
    if (anomaly) {
        recommendations.push({
            title: '⚠️ Address Anomalies',
            text: 'Detected anomalies suggest equipment issues. Conduct immediate inspection and maintenance.'
        });
    }
    
    if (intensity > 10) {
        recommendations.push({
            title: '🏭 Optimize Production Process',
            text: 'Carbon intensity is high. Review furnace efficiency, implement waste heat recovery, and optimize production schedules.'
        });
    }
    
    recommendations.push({
        title: '🔧 Preventive Measures',
        text: 'Regular equipment maintenance, real-time monitoring systems, and employee training can significantly reduce emissions.'
    });
    
    return recommendations;
}

function getOtherRecommendations(intensity, total) {
    const recommendations = [];
    
    if (intensity > 8) {
        recommendations.push({
            title: '📊 High Carbon Intensity',
            text: 'Your emissions per unit are above average. Consider energy audits and efficiency improvements.'
        });
    }
    
    if (total > 5000) {
        recommendations.push({
            title: '🌍 Large Carbon Footprint',
            text: 'Total emissions are significant. Explore renewable energy options and carbon offset programs.'
        });
    }
    
    recommendations.push({
        title: '💡 Energy Efficiency',
        text: 'Conduct an energy audit, upgrade to efficient equipment, and implement ISO 50001 energy management.'
    });
    
    recommendations.push({
        title: '🌱 Renewable Energy',
        text: 'Consider solar panels, wind energy, or purchasing renewable energy certificates to offset emissions.'
    });
    
    return recommendations;
}

function displayResults(result) {
    document.getElementById('total-co2').textContent = result.total_co2;
    document.getElementById('carbon-intensity').textContent = result.carbon_intensity;
    document.getElementById('risk-score').textContent = result.risk_score;
    
    const riskScoreElement = document.getElementById('risk-score');
    riskScoreElement.className = 'result-value';
    if (result.risk_score < 30) {
        riskScoreElement.classList.add('risk-low');
    } else if (result.risk_score < 60) {
        riskScoreElement.classList.add('risk-medium');
    } else {
        riskScoreElement.classList.add('risk-high');
    }
    
    const breakdownDiv = document.getElementById('breakdown');
    breakdownDiv.innerHTML = '<h3>📋 Emission Breakdown</h3>';
    for (const [key, value] of Object.entries(result.breakdown)) {
        breakdownDiv.innerHTML += `
            <div class="breakdown-item">
                <span>${key}</span>
                <strong>${value}</strong>
            </div>
        `;
    }
    
    const recommendationsDiv = document.getElementById('recommendations');
    recommendationsDiv.innerHTML = '<h3>💡 How to Improve</h3>';
    result.recommendations.forEach(rec => {
        recommendationsDiv.innerHTML += `
            <div class="recommendation-item">
                <strong>${rec.title}</strong>
                <p>${rec.text}</p>
            </div>
        `;
    });
    
    // Generate Sustainability Index
    const sustainabilityData = generateSustainabilityIndex(result);
    
    // Save to Firestore
    saveEmissionData(result, sustainabilityData);
    
    document.getElementById('results').style.display = 'block';
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

async function saveEmissionData(result, sustainabilityData) {
    // Check if user is logged in
    if (!currentUser) {
        console.log('User not logged in, skipping save');
        return;
    }
    
    try {
        const industry = result.industry.replace(/\s*\(.*?\)\s*/g, '').toLowerCase();
        const total_co2_kg = parseFloat(result.total_co2);
        const total_co2_tons = total_co2_kg / 1000;
        
        // Baseline emissions (industry average in tons)
        const baselineEmissions = {
            'textile': 8.0,
            'steel': 12.0,
            'other': 6.0
        };
        
        const baseline = baselineEmissions[industry] || baselineEmissions['other'];
        const reduction = Math.max(0, baseline - total_co2_tons);
        const carbon_credits = reduction; // 1 credit = 1 ton reduced
        
        const emissionData = {
            industry: result.industry,
            total_co2: result.total_co2,
            carbon_intensity: result.carbon_intensity,
            risk_score: result.risk_score,
            sustainability_score: sustainabilityData.score,
            baseline_emissions: baseline,
            emission_reduction: reduction.toFixed(2),
            carbon_credits: carbon_credits,
            breakdown: result.breakdown,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        // Save to Firestore
        await db.collection('users')
            .doc(currentUser.uid)
            .collection('emissions')
            .add(emissionData);
        
        // Add to blockchain for immutable record
        const blockchainData = {
            ...emissionData,
            timestamp: Date.now()
        };
        
        const block = await addCarbonCreditToBlockchain(blockchainData);
        
        if (block) {
            console.log('✅ Emission data saved to Firestore and Blockchain');
            console.log('🔗 Block Hash:', block.hash);
            
            // Show success message
            alert(`✅ Carbon Credit Recorded!\n\n` +
                  `Credits Earned: ${carbon_credits.toFixed(2)}\n` +
                  `Block Hash: ${block.hash.substring(0, 16)}...\n` +
                  `Blockchain Verified: ${getBlockchainInstance().isChainValid() ? 'Yes ✓' : 'No ✗'}`);
        }
        
    } catch (error) {
        console.error('Error saving emission data:', error);
        alert('Error saving data. Please try again.');
    }
}

function generateSustainabilityIndex(result) {
    const total_co2 = parseFloat(result.total_co2);
    const carbon_intensity = parseFloat(result.carbon_intensity);
    const risk_score = result.risk_score;
    
    // Calculate Sustainability Score (0-100, higher is better)
    let sustainabilityScore = 100;
    
    // Deduct based on carbon intensity
    if (carbon_intensity > 10) {
        sustainabilityScore -= 30;
    } else if (carbon_intensity > 5) {
        sustainabilityScore -= 15;
    } else if (carbon_intensity > 3) {
        sustainabilityScore -= 5;
    }
    
    // Deduct based on risk score
    sustainabilityScore -= (risk_score * 0.5);
    
    // Deduct based on total emissions
    if (total_co2 > 10000) {
        sustainabilityScore -= 20;
    } else if (total_co2 > 5000) {
        sustainabilityScore -= 10;
    }
    
    sustainabilityScore = Math.max(0, Math.min(100, sustainabilityScore));
    
    // Calculate other metrics
    const energyEfficiency = Math.max(0, 100 - (carbon_intensity * 5));
    const environmentalImpact = 100 - risk_score;
    const carbonFootprint = total_co2 < 1000 ? 'Low' : total_co2 < 5000 ? 'Medium' : 'High';
    const renewableReadiness = sustainabilityScore > 70 ? 'High' : sustainabilityScore > 40 ? 'Medium' : 'Low';
    
    // Determine rating
    let rating, ratingClass, ratingText;
    if (sustainabilityScore >= 80) {
        rating = 'Excellent';
        ratingClass = 'rating-excellent';
        ratingText = 'Outstanding environmental performance!';
    } else if (sustainabilityScore >= 60) {
        rating = 'Good';
        ratingClass = 'rating-good';
        ratingText = 'Good sustainability practices in place.';
    } else if (sustainabilityScore >= 40) {
        rating = 'Fair';
        ratingClass = 'rating-fair';
        ratingText = 'Room for improvement in sustainability.';
    } else if (sustainabilityScore >= 20) {
        rating = 'Poor';
        ratingClass = 'rating-poor';
        ratingText = 'Significant improvements needed.';
    } else {
        rating = 'Critical';
        ratingClass = 'rating-critical';
        ratingText = 'Urgent action required!';
    }
    
    const sustainabilityDiv = document.getElementById('sustainability-index');
    sustainabilityDiv.innerHTML = `
        <h3>🌍 Sustainability Index Report</h3>
        
        <div class="sustainability-score">
            <div class="score-circle">
                <div>
                    <div style="font-size: 3rem; color: var(--accent-green);">${sustainabilityScore.toFixed(0)}</div>
                    <div class="score-label">Sustainability Score</div>
                </div>
            </div>
        </div>
        
        <div class="sustainability-rating">
            <h4 style="color: var(--accent-green); margin-bottom: 10px;">Overall Rating</h4>
            <div class="rating-badge ${ratingClass}">${rating}</div>
            <p style="margin-top: 15px; color: rgba(255, 255, 255, 0.8);">${ratingText}</p>
        </div>
        
        <div class="sustainability-metrics">
            <div class="metric-item">
                <h4>⚡ Energy Efficiency</h4>
                <div class="metric-value">${energyEfficiency.toFixed(0)}%</div>
                <div class="metric-description">How efficiently energy is used</div>
            </div>
            
            <div class="metric-item">
                <h4>🌱 Environmental Impact</h4>
                <div class="metric-value">${environmentalImpact.toFixed(0)}%</div>
                <div class="metric-description">Lower risk = better impact</div>
            </div>
            
            <div class="metric-item">
                <h4>👣 Carbon Footprint</h4>
                <div class="metric-value">${carbonFootprint}</div>
                <div class="metric-description">${total_co2} kg CO2 total</div>
            </div>
            
            <div class="metric-item">
                <h4>♻️ Renewable Readiness</h4>
                <div class="metric-value">${renewableReadiness}</div>
                <div class="metric-description">Potential for green energy</div>
            </div>
        </div>
        
        <div style="background: rgba(234, 245, 238, 0.1); padding: 20px; border-radius: 10px; margin-top: 20px;">
            <h4 style="color: var(--accent-green); margin-bottom: 15px;">📊 Benchmark Comparison</h4>
            <div style="margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>Your Score</span>
                    <strong>${sustainabilityScore.toFixed(0)}/100</strong>
                </div>
                <div style="background: rgba(255,255,255,0.2); height: 10px; border-radius: 5px; overflow: hidden;">
                    <div style="background: var(--accent-green); height: 100%; width: ${sustainabilityScore}%; transition: width 1s ease;"></div>
                </div>
            </div>
            <div style="margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>Industry Average</span>
                    <strong>55/100</strong>
                </div>
                <div style="background: rgba(255,255,255,0.2); height: 10px; border-radius: 5px; overflow: hidden;">
                    <div style="background: #f39c12; height: 100%; width: 55%; transition: width 1s ease;"></div>
                </div>
            </div>
            <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>Best in Class</span>
                    <strong>85/100</strong>
                </div>
                <div style="background: rgba(255,255,255,0.2); height: 10px; border-radius: 5px; overflow: hidden;">
                    <div style="background: #2ecc71; height: 100%; width: 85%; transition: width 1s ease;"></div>
                </div>
            </div>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background: rgba(124, 255, 178, 0.1); border-radius: 10px; border-left: 4px solid var(--accent-green);">
            <strong style="color: var(--accent-green);">💡 Key Insight:</strong>
            <p style="margin-top: 10px; color: rgba(255, 255, 255, 0.9);">
                ${sustainabilityScore >= 70 
                    ? 'Your facility demonstrates strong sustainability practices. Continue monitoring and optimizing to maintain this performance.'
                    : sustainabilityScore >= 40
                    ? 'There is significant potential to improve your sustainability score. Focus on the recommendations provided to reduce emissions and increase efficiency.'
                    : 'Immediate action is recommended to improve sustainability. Prioritize high-impact changes like renewable energy adoption and process optimization.'}
            </p>
        </div>
    `;
    
    return { score: sustainabilityScore };
}
