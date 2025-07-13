import React, { useEffect, useState } from 'react';
import CoachSelector from './CoachSelector';
import ChatBox from './ChatBox';
import { useUser } from "../../userContext/userContext";
import './chat.css'; // Shared chat styles

export default function ChatPage({ jwt }) {
  const { user } = useUser();
  const [coaches, setCoaches] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = jwt || (localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken"));
    setLoading(true);
    setError(null);
    
    fetch('/api/users/role/COACH', {
      headers: { Authorization: token }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch coaches');
        return res.json();
      })
      .then(data => {
        const arr = Array.isArray(data) ? data : data.data;
        setCoaches(
          (arr || []).map(coach => ({
            userId: coach.userId ?? coach.id ?? coach._id,
            name: coach.name || coach.fullName || coach.username || "Unnamed Coach",
            ...coach
          }))
        );
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load coaches. Please try again.');
      })
      .finally(() => setLoading(false));
  }, [jwt]);

  return (
    <div className="chat-page-container">
      {!selectedCoach ? (
        <div className="coach-selection-section">
          
          {loading ? (
            <div className="loading-message">Loading available coaches...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <CoachSelector
              coaches={coaches}
              onSelect={setSelectedCoach}
              selectedCoach={selectedCoach}
            />
          )}
        </div>
      ) : (
        <ChatBox
          fromUser={user}
          toUser={selectedCoach}
          jwt={jwt}
          onBack={() => setSelectedCoach(null)}
        />
      )}
    </div>
  );
}