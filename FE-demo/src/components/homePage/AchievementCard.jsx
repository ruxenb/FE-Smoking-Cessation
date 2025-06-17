import React from 'react';

function AchievementCard({ icon, name, locked }) {
  const cardClass = `achievement-card ${locked ? 'locked' : 'unlocked'}`;
  return (
    <div className={cardClass}>
      <div className="ach-icon">{icon}</div>
      <p>{name}</p>
    </div>
  );
}

export default AchievementCard;