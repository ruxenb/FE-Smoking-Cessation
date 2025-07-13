import React, { useEffect, useState } from 'react';
import ChatBox from './ChatBox'; // The real-time chat component

export default function CoachChatPage({ coach, jwt }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    // Fetch all users except the coach themselves
    fetch('/api/users', {
      headers: { Authorization: `Bearer ${jwt}` }
    })
      .then(res => res.json())
      .then(data => setUsers(data.filter(u => u.userId !== coach.userId)))
      .catch(console.error);
  }, [jwt, coach.userId]);

  return (
    <div>
      {!selectedUser ? (
        <div>
          <h3>Select a user to chat with:</h3>
          <ul>
            {users.map(user => (
              <li key={user.userId}>
                <button onClick={() => setSelectedUser(user)}>
                  {user.name || `User ${user.userId}`}
                </button>
              </li>
            ))}
          </ul>
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