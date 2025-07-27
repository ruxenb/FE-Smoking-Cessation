import React from 'react';
import './chat.css'; // Import the separate CSS file

export default function CoachSelector({ coaches = [], onSelect, selectedCoach, onlineUserIds }) {
  return (
    <div className="coach-selector-container">
      <h3 className="coach-selector-header">Select your coach to start chatting:</h3>
      <div className="coach-list">
        {coaches.length === 0 ? (
          <div className="no-coaches-message">No coaches available</div>
        ) : (
          coaches.map(coach => (
            <div
              key={coach.userId}
              className="coach-card"
              onClick={() => onSelect(coach)}
            >
              <div className="coach-avatar">👤</div>
              <div className="coach-info">
                <div className="coach-name">
                  {coach.name}
                  {onlineUserIds.includes(coach.userId) && (
                    <span className="online-dot" />
                  )}
                </div>
                <div className="coach-id">ID: {coach.userId}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}