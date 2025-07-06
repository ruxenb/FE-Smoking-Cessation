import React from 'react';
import api from '../../configs/axios';

export default function LikeButtons({ postId, userId, refreshLikes }) {
  const handleLike = async () => {
    await api.post(`/likes/like?postId=${postId}&userId=${userId}`);
    refreshLikes(postId);
  };

  const handleUnlike = async () => {
    await api.post(`/likes/unlike?postId=${postId}&userId=${userId}`);
    refreshLikes(postId);
  };

  return (
    <div>
      <button onClick={handleLike} style={{ marginRight: 10 }}>👍 Like</button>
      <button onClick={handleUnlike}>👎 Unlike</button>
    </div>
  );
}