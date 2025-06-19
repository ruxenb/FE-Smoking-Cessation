import React from 'react';

// We now accept 'iconClass' instead of 'backgroundColor'
function StatCard({ icon, iconClass, value, label }) {
  return (
    <div className="stat-card">
      {/* We apply the passed class name here */}
      <div className={`card-icon ${iconClass}`}>
        {icon}
      </div>
      <div className="card-content">
        <span className="stat-value">{value}</span>
        <span className="stat-label">{label}</span>
      </div>
    </div>
  );
}

export default StatCard;