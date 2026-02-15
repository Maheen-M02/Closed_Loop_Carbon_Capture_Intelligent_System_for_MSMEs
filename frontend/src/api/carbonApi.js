const BASE_URL = 'http://localhost:3000/api';

export async function getDemoAnalysis() {
  const response = await fetch(`${BASE_URL}/demo-analysis`);
  if (!response.ok) {
    throw new Error('Failed to fetch demo analysis');
  }
  return response.json();
}

export async function simulateScenario(baseData, adjustments) {
  const response = await fetch(`${BASE_URL}/simulate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ baseData, adjustments }),
  });
  if (!response.ok) {
    throw new Error('Failed to simulate scenario');
  }
  return response.json();
}

export function downloadESGReport() {
  window.open(`${BASE_URL}/esg-report/pdf`, '_blank');
}

export function downloadBlockchainCertificate() {
  window.open(`${BASE_URL}/blockchain-certificate/pdf`, '_blank');
}
