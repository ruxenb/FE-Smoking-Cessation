import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export default function PostCard({ post, onLike }) {
  const [likes, setLikes] = useState(post.likes || 0);
  const navigate = useNavigate();
  
  const handleLike = (e) => {
    e.stopPropagation();
    setLikes(likes + 1);
    onLike(post.postId);
  };

  const handleCardClick = () => {
    navigate(`/blog/${post.postId}`);
  };

  return (
    <div className="post-card" onClick={handleCardClick}>
      <div className="post-header">
        <div className="user-avatar">U{post.userId}</div>
        <div className="post-meta">
          <div className="post-title">{post.title}</div>
          <div className="post-info">
            <span>Posted by user {post.userId}</span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
            <span className="tag">{post.category || 'Journey'}</span>
          </div>
        </div>
      </div>
      <div className="post-actions">
        <button className="action-btn" onClick={handleLike}>
          <span>❤️</span>
          <span className="like-count">{likes}</span>
        </button>
        <button className="action-btn">
          <span>💬</span>
          <span>{post.commentCount || 0} comments</span>
        </button>
        <button className="action-btn">
          <span>📤</span>
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}