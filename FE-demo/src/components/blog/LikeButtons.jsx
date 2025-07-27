import React, { useState, useEffect } from 'react';
import api from '../../configs/axios';
import toast from 'react-hot-toast';

export default function LikeButtons({ postId, userId }) {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        // Get like count
        const countRes = await api.get(`/likes/count?postId=${postId}`);
        setLikes(countRes.data.data);
        
        // Check if user liked this post
        if (userId) {
          const statusRes = await api.get(`/likes/status?postId=${postId}&userId=${userId}`);
          setIsLiked(statusRes.data.data);
        }
      } catch (err) {
        console.error("Error fetching like status:", err);
      }
    };
    
    fetchLikeStatus();
  }, [postId, userId]);

  const handleLike = async () => {
    if (!userId) {
      toast.error("Please login to like posts");
      return;
    }

    try {
      if (isLiked) {
        await api.post(`/likes/unlike?postId=${postId}&userId=${userId}`);
        setLikes(likes - 1);
        toast.success("Post unliked!");
      } else {
        await api.post(`/likes/like?postId=${postId}&userId=${userId}`);
        setLikes(likes + 1);
        toast.success("Post liked!");
      }
      setIsLiked(!isLiked);
    } catch (err) {
      toast.error("Error updating like status");
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