// CoachSelector.jsx
import React from 'react';

export default function CoachSelector({ coaches = [], onSelect, selectedCoach }) {
  return (
    <div>
      <h3>Select your coach to start chatting:</h3>
      <ul>
        {coaches.length === 0 ? (
          <li>No coaches available.</li>
        ) : (
          coaches.map(coach => {
            // Always normalize to userId and name
            const normalizedCoach = {
              userId: coach.userId ?? coach.id ?? coach._id, // add more fallbacks if needed
              name: coach.name || coach.fullName || coach.username || "Unnamed",
              ...coach
            };
            return (
              <li key={normalizedCoach.userId ?? normalizedCoach.id ?? Math.random()}>
                <button
                  disabled={selectedCoach && selectedCoach.userId === normalizedCoach.userId}
                  onClick={() => onSelect(normalizedCoach)}
                >
                  {normalizedCoach.name}
                </button>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}