import React from 'react';
import api from '../../configs/axios';

export default function LikeButtons({ postId, userId, likes, setLikes }) {
  const [isLiked, setIsLiked] = React.useState(false);

  const handleLike = async () => {
    try {
      if (isLiked) {
        await api.post(`/likes/unlike?postId=${postId}&userId=${userId}`);
        setLikes(likes - 1);
      } else {
        await api.post(`/likes/like?postId=${postId}&userId=${userId}`);
        setLikes(likes + 1);
      }
      setIsLiked(!isLiked);
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  return (
    <button 
      className={`action-btn ${isLiked ? 'liked' : ''}`} 
      onClick={handleLike}
    >
      <span>{isLiked ? '❤️' : '🤍'}</span>
      <span>{likes} likes</span>
    </button>
  );
}