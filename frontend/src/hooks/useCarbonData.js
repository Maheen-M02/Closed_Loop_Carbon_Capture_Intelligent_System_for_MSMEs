import { useState, useEffect } from 'react';
import { getDemoAnalysis, simulateScenario } from '../api/carbonApi';

export function useCarbonData() {
  const [data, setData] = useState(null);
  const [baseData, setBaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDemoData();
  }, []);

  async function loadDemoData() {
    try {
      setLoading(true);
      setError(null);
      const response = await getDemoAnalysis();
      if (response.success) {
        setData(response.data);
        setBaseData(extractBaseData(response.data));
      } else {
        throw new Error('Failed to load data');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function extractBaseData(analysisData) {
    // Get the actual demo data from the backend
    // The backend should include the original input data
    return {
      total_emission_tons: analysisData.emissions,
      total_production_units: 911011.338785538,
      peak_emission_tons: 0.1288876,
      previous_month_emission_tons: 68.3504768,
      hourly_emissions_array: [
        0.006463402197802197,
        0.004979433150684931,
        0.003631280136986301,
        0.0035735936986301367,
        0.0035337394520547944,
        0.0034813493150684933,
        0.0034634384931506845,
        0.0036917017808219175,
        0.03091793150684931,
        0.04801242095890411,
        0.045817280958904104,
        0.04681991630136986,
        0.015138019999999999,
        0.03199599,
        0.04604731342465753,
        0.04562278369863013,
        0.04575565739726027,
        0.035943138630136984,
        0.02707716383561644,
        0.03133098123287671,
        0.03073132534246575,
        0.011297437671232877,
        0.0071003126027397254,
        0.006558371232876712
      ],
      anomaly_count: 351,
      total_hours: 8759.0,
      downtime_minutes: 291675,
      total_runtime_minutes: 233865.0,
      industry_benchmark_intensity: 2.0,
      predicted_next_month_emission_tons: 49.34570704242426
    };
  }

  async function simulate(adjustments) {
    if (!baseData) return;

    try {
      setLoading(true);
      setError(null);
      const response = await simulateScenario(baseData, adjustments);
      if (response.success) {
        setData(prevData => ({
          ...prevData,
          metrics: response.data.metrics,
          financial_impact: response.data.financial_impact,
          micro_capture: response.data.micro_capture || prevData.micro_capture
        }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, simulate };
}
