import React from 'react';
import './chat.css'; // Import the separate CSS file

export default function CoachSelector({ coaches = [], onSelect, selectedCoach }) {
  return (
    <div className="coach-selector-container">
      <h3 className="coach-selector-header">Select your coach to start chatting:</h3>
      <div className="coach-list">
        {coaches.length === 0 ? (
          <div className="no-coaches-message">No coaches available</div>
        ) : (
          coaches.map(coach => {
            const normalizedCoach = {
              userId: coach.userId ?? coach.id ?? coach._id,
              name: coach.name || coach.fullName || coach.username || "Unnamed Coach",
              ...coach
            };
            
            return (
              <div 
                key={normalizedCoach.userId} 
                className={`coach-card ${selectedCoach?.userId === normalizedCoach.userId ? 'selected' : ''}`}
                onClick={() => onSelect(normalizedCoach)}
              >
                <div className="coach-avatar">👤</div>
                <div className="coach-info">
                  <div className="coach-name">{normalizedCoach.name}</div>
                  {selectedCoach?.userId === normalizedCoach.userId && (
                    <div className="selected-indicator">Selected ✓</div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}