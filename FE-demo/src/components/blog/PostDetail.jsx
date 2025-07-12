import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../configs/axios';
import './BlogApp.css';
import { Navbar } from '../../components/home/homePage';
import CommentSection from './CommentSection';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const [postRes, commentsRes, likesRes] = await Promise.all([
          api.get(`/posts/${id}`),
          api.get(`/comments/post/${id}`),
          api.get(`/likes/count?postId=${id}`)
        ]);
        setPost(postRes.data.data);
        setComments(commentsRes.data.data);
        setLikes(likesRes.data.data);

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          // Check if user liked this post
          const statusRes = await api.get(`/likes/status?postId=${id}&userId=${parsedUser.userId}`);
          setIsLiked(statusRes.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch post data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [id]);

  const handleLike = async () => {
    if (!user) {
      alert("Please login to like posts");
      return;
    }

    try {
      if (isLiked) {
        await api.post(`/likes/unlike?postId=${id}&userId=${user.userId}`);
      } else {
        await api.post(`/likes/like?postId=${id}&userId=${user.userId}`);
      }
      // Always re-fetch the latest like count and status from backend
      const [likesRes, statusRes] = await Promise.all([
        api.get(`/likes/count?postId=${id}`),
        api.get(`/likes/status?postId=${id}&userId=${user.userId}`)
      ]);
      setLikes(likesRes.data.data);
      setIsLiked(statusRes.data.data);
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!user) {
      alert("Please login to comment");
      return;
    }

    try {
      await api.post('/comments', {
        postId: id,
        userId: user.userId,
        content: newComment
      });
      setNewComment('');
      // Refresh comments
      const res = await api.get(`/comments/post/${id}`);
      setComments(res.data.data);
    } catch (err) {
      console.error("Failed to post comment", err);
    }
  };

  if (loading) {
    return <div className="loading">Loading post...</div>;
  }

  if (!post) {
    return <div className="no-posts">Post not found</div>;
  }

  // Only show edit button if user is owner
  const isOwner = user && post && user.userId === post.userId;

  return (
    <>
      {!user && <Navbar />}
      <div className="blog-container">
        <div className="header">
          <h1>
            <div className="header-icon">🌱</div>
            Green Posts
          </h1>
        </div>

        <div className="content-area">
          <button
            onClick={() => navigate(-1)}
            className="back-button"
          >
            ← Back to Blog
          </button>

          <div className="post-detail-card">
            <div className="post-header">
              <div className="user-avatar">U{post.userId}</div>
              <div className="post-meta">
                <div className="post-title">{post.title}</div>
                <div className="post-info">
                  <span>Posted by user {post.userId}</span>
                  <span>•</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <span className="tag">{post.category || 'Journey'}</span>
                </div>
              </div>
            </div>

            <div className="post-content">
              {post.content}
            </div>

            <div className="post-actions">
              <button
                className={`action-btn ${isLiked ? 'liked' : ''}`}
                onClick={handleLike}
              >
                <span>{isLiked ? '❤️' : '🤍'}</span>
                <span className="like-count">{likes} likes</span>
              </button>
              <button className="action-btn">
                <span>💬</span>
                <span>{comments.length} comments</span>
              </button>
              {isOwner && (
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/blog/${id}/edit`)}
                >
                  Edit Post
                </button>
              )}
            </div>

            <CommentSection postId={id} user={user} />
          </div>
        </div>
      </div>
    </>
  );
}