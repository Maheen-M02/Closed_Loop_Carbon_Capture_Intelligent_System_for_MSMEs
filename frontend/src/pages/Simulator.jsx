import { useState } from 'react';
import { useCarbonData } from '../hooks/useCarbonData';

export default function Simulator() {
  const { data, loading, simulate } = useCarbonData();
  const [energyChange, setEnergyChange] = useState(0);
  const [loadChange, setLoadChange] = useState(0);
  const [runtimeChange, setRuntimeChange] = useState(0);
  const [simulating, setSimulating] = useState(false);

  const handleSimulate = async () => {
    setSimulating(true);
    await simulate({
      energy_change_percent: energyChange,
      load_change_percent: loadChange,
      runtime_change_percent: runtimeChange
    });
    setSimulating(false);
  };

  const handleReset = () => {
    setEnergyChange(0);
    setLoadChange(0);
    setRuntimeChange(0);
  };

  if (loading) return <div className="loading-container"><div className="loading-text">Loading...</div></div>;
  if (!data) return null;

  return (
    <div className="enterprise-page">
      <div className="enterprise-header">
        <div className="header-icon">🔬</div>
        <div className="header-content">
          <h1 className="header-title">What-If Simulator</h1>
          <div className="header-meta">
            <span className="meta-text">Model emission scenarios</span>
          </div>
        </div>
      </div>

      <div className="enterprise-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
        <div className="card-compact">
          <div className="card-header-compact">Scenario Parameters</div>
          <div className="sliders-compact">
            <div className="slider-compact">
              <div className="slider-header-compact">
                <span>⚡ Energy Change</span>
                <span className="slider-value-compact accent">{energyChange}%</span>
              </div>
              <input
                type="range"
                min="-20"
                max="20"
                value={energyChange}
                onChange={(e) => setEnergyChange(Number(e.target.value))}
                className="slider-input"
              />
              <div className="slider-labels-compact">
                <span>-20%</span>
                <span>0%</span>
                <span>+20%</span>
              </div>
            </div>

            <div className="slider-compact">
              <div className="slider-header-compact">
                <span>📊 Load Change</span>
                <span className="slider-value-compact accent">{loadChange}%</span>
              </div>
              <input
                type="range"
                min="-20"
                max="20"
                value={loadChange}
                onChange={(e) => setLoadChange(Number(e.target.value))}
                className="slider-input"
              />
              <div className="slider-labels-compact">
                <span>-20%</span>
                <span>0%</span>
                <span>+20%</span>
              </div>
            </div>

            <div className="slider-compact">
              <div className="slider-header-compact">
                <span>⏱️ Runtime Change</span>
                <span className="slider-value-compact accent">{runtimeChange}%</span>
              </div>
              <input
                type="range"
                min="-20"
                max="20"
                value={runtimeChange}
                onChange={(e) => setRuntimeChange(Number(e.target.value))}
                className="slider-input"
              />
              <div className="slider-labels-compact">
                <span>-20%</span>
                <span>0%</span>
                <span>+20%</span>
              </div>
            </div>
          </div>

          <div className="actions-compact">
            <button className="btn-primary-compact" onClick={handleSimulate} disabled={simulating}>
              {simulating ? 'Simulating...' : '▶ Run Simulation'}
            </button>
            <button className="btn-secondary-compact" onClick={handleReset}>
              ↺ Reset
            </button>
          </div>
        </div>

        <div className="card-compact">
          <div className="card-header-compact">Simulated Results</div>
          <div className="metrics-grid-compact">
            <div className="metric-mini">
              <div className="metric-icon">⚠️</div>
              <div>
                <div className="metric-value-mini accent">{data.metrics?.carbon_risk_score}</div>
                <div className="metric-label-mini">Risk Score</div>
              </div>
            </div>
            <div className="metric-mini">
              <div className="metric-icon">📊</div>
              <div>
                <div className="metric-value-mini">{data.metrics?.carbon_intensity?.toFixed(3)}</div>
                <div className="metric-label-mini">Intensity</div>
              </div>
            </div>
            <div className="metric-mini">
              <div className="metric-icon">📈</div>
              <div>
                <div className="metric-value-mini">{data.metrics?.volatility?.toFixed(2)}</div>
                <div className="metric-label-mini">Volatility</div>
              </div>
            </div>
            <div className="metric-mini">
              <div className="metric-icon">💰</div>
              <div>
                <div className="metric-value-mini accent">{data.financial_impact?.roi_percent?.toFixed(1)}%</div>
                <div className="metric-label-mini">ROI</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card-compact" style={{ gridColumn: 'span 2' }}>
          <div className="card-header-compact">Financial Impact</div>
          <div className="financial-grid-compact">
            <div className="financial-item-compact">
              <div className="financial-label-compact">Carbon Credits</div>
              <div className="financial-value-compact accent">{data.financial_impact?.carbon_credits_generated?.toFixed(2)}</div>
            </div>
            <div className="financial-item-compact">
              <div className="financial-label-compact">Credit Value (Min)</div>
              <div className="financial-value-compact">₹{data.financial_impact?.estimated_credit_value_min?.toLocaleString('en-IN')}</div>
            </div>
            <div className="financial-item-compact">
              <div className="financial-label-compact">Credit Value (Max)</div>
              <div className="financial-value-compact accent">₹{data.financial_impact?.estimated_credit_value_max?.toLocaleString('en-IN')}</div>
            </div>
            <div className="financial-item-compact">
              <div className="financial-label-compact">Potential Reduction</div>
              <div className="financial-value-compact">{data.financial_impact?.potential_reduction_tons?.toFixed(2)} tons</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
