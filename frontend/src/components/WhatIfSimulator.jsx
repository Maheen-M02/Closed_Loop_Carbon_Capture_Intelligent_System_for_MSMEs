import { useState } from 'react';

export default function WhatIfSimulator({ onSimulate }) {
  const [energyChange, setEnergyChange] = useState(0);
  const [loadChange, setLoadChange] = useState(0);
  const [runtimeChange, setRuntimeChange] = useState(0);

  const handleSimulate = () => {
    onSimulate({
      energy_change_percent: energyChange,
      load_change_percent: loadChange,
      runtime_change_percent: runtimeChange
    });
  };

  return (
    <div className="card">
      <h2 className="section-title">What-If Simulator</h2>
      <div className="simulator-controls">
        <div className="slider-group">
          <label>Energy Change: {energyChange}%</label>
          <input
            type="range"
            min="-20"
            max="20"
            value={energyChange}
            onChange={(e) => setEnergyChange(Number(e.target.value))}
          />
        </div>
        <div className="slider-group">
          <label>Load Change: {loadChange}%</label>
          <input
            type="range"
            min="-20"
            max="20"
            value={loadChange}
            onChange={(e) => setLoadChange(Number(e.target.value))}
          />
        </div>
        <div className="slider-group">
          <label>Runtime Change: {runtimeChange}%</label>
          <input
            type="range"
            min="-20"
            max="20"
            value={runtimeChange}
            onChange={(e) => setRuntimeChange(Number(e.target.value))}
          />
        </div>
        <button className="simulate-button" onClick={handleSimulate}>
          Run Simulation
        </button>
      </div>
    </div>
  );
}
