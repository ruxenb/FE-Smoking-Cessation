import React, { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';
import './chat.css';
import SmokingProfileInfo from '../dashboard/smokeInfo';

const WS_URL = 'http://localhost:8080/ws-chat';

export default function ChatBox({ fromUser, toUser, onBack, onlineUserIds = [] }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [peerTyping, setPeerTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showProfileOverlay, setShowProfileOverlay] = useState(false);
  const messagesEndRef = useRef(null);
  const stompClient = useRef(null);

  const jwt = localStorage.getItem("accessToken");

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch chat history
  useEffect(() => {
    axios.get(`/api/chat/history?userId1=${fromUser.userId}&userId2=${toUser.userId}`, {
      headers: { Authorization: `Bearer ${jwt}` }
    })
      .then(res => {
        setMessages(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [fromUser.userId, toUser.userId, jwt]);

  // Connect to WebSocket and subscribe
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: { Authorization: `Bearer ${jwt}` },
      onConnect: () => {
        client.subscribe(`/topic/chat.${fromUser.userId}`, msg => {
          const body = JSON.parse(msg.body);
          
          if (body.content !== undefined) {
            setMessages(prev => [...prev, body]);
          } else if (body.typing !== undefined && body.fromUserId === toUser.userId) {
            setPeerTyping(body.typing);
          }
        });
        client.subscribe('/topic/online-users', msg => {
          const body = JSON.parse(msg.body);
          setOnlineUserIds(body.userIds);
        });
      },
      onStompError: frame => {
        console.error('Broker error:', frame.headers['message']);
      }
    });
    client.activate();
    stompClient.current = client;
    return () => client.deactivate();
  }, [fromUser.userId, toUser.userId, jwt]);

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, peerTyping]);

  // Send message
  const sendMessage = e => {
    e.preventDefault();
    if (!input.trim() || !stompClient.current?.connected) return;
    const msg = {
      fromUserId: fromUser.userId,
      toUserId: toUser.userId,
      content: input,
      timestamp: new Date().toISOString().replace('Z', '')
    };
    stompClient.current.publish({
      destination: '/app/chat.send',
      body: JSON.stringify(msg)
    });
    setInput('');
    setTyping(false);
  };

  // Typing indicator
  useEffect(() => {
    if (!stompClient.current?.connected) return;
    if (typing) {
      stompClient.current.publish({
        destination: '/app/chat.typing',
        body: JSON.stringify({ fromUserId: fromUser.userId, toUserId: toUser.userId, typing: true })
      });
      const timeout = setTimeout(() => setTyping(false), 2000);
      return () => clearTimeout(timeout);
    } else {
      stompClient.current.publish({
        destination: '/app/chat.typing',
        body: JSON.stringify({ fromUserId: fromUser.userId, toUserId: toUser.userId, typing: false })
      });
    }
  }, [typing, fromUser.userId, toUser.userId]);

  // Fetch smoking profile
  const fetchSmokingProfile = async () => {
    try {
      const res = await axios.get(`/api/users/smokingprofile/${toUser.userId}`, {
        headers: { Authorization: `Bearer ${jwt}` }
      });
      return res.data.data;
    } catch (err) {
      console.error('Failed to fetch smoking profile:', err);
      return null;
    }
  };

  if (!fromUser?.userId || !toUser?.userId) {
    return <div className="chat-error">Error: User information missing or invalid.</div>;
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <h2>
          {toUser.name || toUser.fullName || toUser.username || `User ${toUser.userId}`}
          {onlineUserIds?.includes(toUser.userId) && <span className="online-dot" />}
        </h2>
        {fromUser.role === 'COACH' && (
          <button 
            className="profile-button"
            onClick={() => setShowProfileOverlay(true)}
            title="View user's smoking profile"
          >
            📊
          </button>
        )}
      </div>
      
      <div className="messages-container">
        {loading ? (
          <div className="loading-message">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="no-messages">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`message ${msg.fromUserId === fromUser.userId ? 'sent' : 'received'}`}
            >
              <div className="message-content">
                <div className="message-sender">
                  {msg.fromUserId === fromUser.userId ? 'You' : (toUser.name || toUser.fullName || toUser.username || `User ${toUser.userId}`)}
                </div>
                <div className="message-text">{msg.content}</div>
                <div className="message-time">
                  {msg.timestamp
                    ? new Date(msg.timestamp + 'Z').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : ''}
                </div>
              </div>
            </div>
          ))
        )}
        {peerTyping && (
          <div className="typing-indicator">
            {toUser.name || `User ${toUser.userId}`} is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={sendMessage} className="message-form">
        <input
          value={input}
          onChange={e => {
            setInput(e.target.value);
            if (e.target.value) setTyping(true);
          }}
          placeholder="Type a message..."
          className="message-input"
          disabled={!stompClient.current?.connected}
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={!input.trim() || !stompClient.current?.connected}
        >
          Send
        </button>
      </form>

      {showProfileOverlay && (
        <ProfileOverlay 
          userId={toUser.userId}
          onClose={() => setShowProfileOverlay(false)}
          fetchProfile={fetchSmokingProfile}
        />
      )}
    </div>
  );
}

// Add this component inside ChatBox.jsx or create a separate file
const ProfileOverlay = ({ userId, onClose, fetchProfile }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const data = await fetchProfile();
      setProfileData(data);
      setLoading(false);
    };
    loadProfile();
  }, [userId]);

  return (
    <div className="profile-overlay">
      <div className="profile-overlay-content">
        <div className="overlay-header">
          <h3>User Smoking Profile</h3>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        <div className="overlay-body">
          {loading ? (
            <div className="loading">Loading profile...</div>
          ) : profileData ? (
            <SmokingProfileInfo smokingProfile={profileData} />
          ) : (
            <div className="no-profile">No smoking profile available for this user.</div>
          )}
        </div>
      </div>
    </div>
  );
};