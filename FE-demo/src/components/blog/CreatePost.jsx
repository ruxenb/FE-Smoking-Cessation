import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../configs/axios';
import './BlogApp.css';

export default function CreatePost() {
  const navigate = useNavigate();
  const [post, setPost] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return (
      <div className="post-form">
        <h2>Create Post</h2>
        <div className="error-message">Please login to create posts</div>
        <button className="auth-redirect-btn" onClick={() => navigate('/login')}>Go to Login</button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log("Sending:", { ...post, userId: user.id }); // 👈 Add this line
      await api.post('/posts', { ...post, userId: user.userId }); // or whatever the correct property is
      navigate('/blog');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-form">
      <h2>Create Post</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={post.title}
            onChange={e => setPost({ ...post, title: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Your Story</label>
          <textarea
            value={post.content}
            onChange={e => setPost({ ...post, content: e.target.value })}
            rows="10"
            required
          />
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Publishing...' : 'Publish Post'}
        </button>
      </form>
    </div>
  );
}