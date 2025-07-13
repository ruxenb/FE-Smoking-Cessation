import React, { useEffect, useState } from 'react';
import ChatBox from './ChatBox';
import './chat.css'; // Import the shared chat styles

export default function CoachChatPage({ coach, jwt }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/users/role/MEMBER', {
      headers: { Authorization: `Bearer ${jwt}` }
    })
      .then(res => res.json())
      .then(data => {
        setUsers((data.data || []).filter(u => u.userId !== coach.userId));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [jwt, coach.userId]);

  return (
    <div className="chat-page-container">
      {!selectedUser ? (
        <div className="user-selection-container">
          <h3 className="selection-header">Select a user to chat with:</h3>
          {loading ? (
            <div className="loading-indicator">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="no-users-message">No users available</div>
          ) : (
            <div className="user-list">
              {users.map(user => (
                <div 
                  key={user.userId} 
                  className="user-card"
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="user-avatar">👤</div>
                  <div className="user-info">
                    <div className="user-name">
                      {user.name || user.fullName || user.username || `User ${user.userId}`}
                    </div>
                    <div className="user-id">ID: {user.userId}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <ChatBox
          fromUser={coach}
          toUser={selectedUser}
          jwt={jwt}
          onBack={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}