import React, { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';

const WS_URL = 'http://localhost:8080/ws-chat';

function getRoomId(fromUserId, toUserId) {
  // Always sort to ensure both sides use the same room
  return [fromUserId, toUserId].sort().join('-');
}

export default function ChatBox({ fromUser, toUser, onBack }) {
//   console.log("fromUser", fromUser);
//   console.log("toUser", toUser);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [peerTyping, setPeerTyping] = useState(false);
  const stompClient = useRef(null);
  const roomId = getRoomId(fromUser.userId, toUser.userId);

  // Always get the raw token (no "Bearer " prefix)
  const jwt = localStorage.getItem("accessToken"); // just the token string
//   console.log("JWT for STOMP:", jwt);

  // Fetch chat history
  useEffect(() => {
    axios.get(`/api/chat/history?userId1=${fromUser.userId}&userId2=${toUser.userId}`, {
      headers: { Authorization: `Bearer ${jwt}` } // <-- prefix with Bearer
    })
      .then(res => setMessages(res.data))
      .catch(console.error);
  }, [fromUser.userId, toUser.userId, jwt]);

  // Connect to WebSocket
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: { Authorization: `Bearer ${jwt}` }, // <-- prefix with Bearer
      onConnect: () => {
        client.subscribe(`/topic/chat.${roomId}`, msg => {
          const body = JSON.parse(msg.body);
          setMessages(prev => [...prev, body]);
        });
        client.subscribe(`/topic/chat.typing.${roomId}`, msg => {
          setPeerTyping(msg.body === 'true');
        });
      },
      onStompError: frame => {
        console.error('Broker error:', frame.headers['message']);
      }
    });
    client.activate();
    stompClient.current = client;
    return () => client.deactivate();
  }, [roomId, jwt]);

  // Send message
  const sendMessage = e => {
    e.preventDefault();
    if (!input.trim() || !stompClient.current?.connected) return;
    const msg = {
      fromUserId: fromUser.userId,
      toUserId: toUser.userId,
      content: input,
      timestamp: new Date().toISOString().replace('Z', '') // remove the Z
    };
    stompClient.current.publish({
      destination: '/app/chat.send',
      body: JSON.stringify(msg)
    });
    setMessages(prev => [...prev, { ...msg, self: true }]);
    setInput('');
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

  if (!fromUser?.userId || !toUser?.userId) {
    return <div>Error: User information missing or invalid.</div>;
  }

  return (
    <div className="main-content" style={{ maxWidth: 500, margin: '2rem auto' }}>
      <button onClick={onBack} style={{ marginBottom: 10 }}>← Back</button>
      <h2>Chat with {toUser.name || `User ${toUser.userId}`}</h2>
      <div style={{ border: '1px solid #ccc', height: 300, overflowY: 'auto', padding: 10, marginBottom: 10 }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              margin: '8px 0',
              textAlign: msg.fromUserId === fromUser.userId ? 'right' : 'left'
            }}
          >
            <strong>
              {msg.fromUserId === fromUser.userId
                ? 'You'
                : toUser.name || `User ${toUser.userId}`}
              :
            </strong>{' '}
            {msg.content}
            <div style={{ fontSize: '0.8em', color: '#888' }}>
              {msg.timestamp
                ? new Date(msg.timestamp + 'Z').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : ''}
            </div>
          </div>
        ))}
        {peerTyping && <div style={{ color: '#888' }}>{toUser.name || `User ${toUser.userId}`} is typing...</div>}
      </div>
      <form onSubmit={sendMessage} style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={e => {
            setInput(e.target.value);
            setTyping(true);
          }}
          placeholder="Type a message..."
          style={{ flex: 1 }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}