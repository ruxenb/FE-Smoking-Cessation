import React, { useEffect, useState } from 'react';
import CoachSelector from './CoachSelector';
import ChatBox from './ChatBox';
import { useUser } from "../../userContext/userContext"; // adjust path if needed

export default function ChatPage({ jwt }) {
  const { user } = useUser(); // get user from context
  const [coaches, setCoaches] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState(null);

  useEffect(() => {
    const token = jwt || (localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken"));
    fetch('/api/users/role/COACH', {
      headers: { Authorization: token }
    })
      .then(res => res.json())
      .then(data => {
        // Normalize all coaches to have userId and name
        const arr = Array.isArray(data) ? data : data.data;
        setCoaches(
          (arr || []).map(coach => ({
            userId: coach.userId ?? coach.id ?? coach._id,
            name: coach.name || coach.fullName || coach.username || "Unnamed",
            ...coach
          }))
        );
      })
      .catch(console.error);
  }, [jwt]);

  return (
    <div>
      {!selectedCoach ? (
        <CoachSelector
          coaches={coaches}
          onSelect={setSelectedCoach}
          selectedCoach={selectedCoach}
        />
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