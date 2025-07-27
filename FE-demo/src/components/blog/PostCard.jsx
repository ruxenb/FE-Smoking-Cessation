import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import api from "../../configs/api/axios";

export default function PostCard({ post }) {
  const navigate = useNavigate();
  const [likes, setLikes] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const likeRes = await api.get(`/likes/count?postId=${post.postId}`);
        const commentRes = await api.get(`/comments/post/${post.postId}`);
        setLikes(likeRes.data.data || 0);
        setCommentsCount(
          (commentRes.data.data && commentRes.data.data.length) || 0
        );
      } catch (err) {
        setLikes(0);
        setCommentsCount(0);
      }
    };
    fetchMeta();
  }, [post.postId]);

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
            <span>Posted by {post.authorName || `User ${post.userId}`}</span>
            <span>•</span>
            <span>
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </span>
            {/* <span className="tag">{post.category || "Journey"}</span> */}
          </div>
        </div>
      </div>
      <div className="post-actions">
        <button className="action-btn" disabled>
          <span>❤️</span>
          <span className="like-count">{likes}</span>
        </button>
        <button className="action-btn" disabled>
          <span>💬</span>
          <span>{commentsCount} comments</span>
        </button>
      </div>
    </div>
  );
}
