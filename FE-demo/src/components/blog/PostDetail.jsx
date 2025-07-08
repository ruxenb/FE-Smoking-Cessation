import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../configs/axios';
import './BlogApp.css'; // Reuse the same CSS

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
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
        if (storedUser) setUser(JSON.parse(storedUser));
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
      await api.post(`/likes/like?postId=${id}&userId=${user.id}`);
      setLikes(likes + 1);
    } catch (err) {
      console.error("Failed to like post", err);
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
        userId: user.id,
        content: newComment
      });
      
      const res = await api.get(`/comments/post/${id}`);
      setComments(res.data.data);
      setNewComment('');
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

  return (
    <div className="blog-container">
      <div className="header">
        <h1>
          <div className="header-icon">🌱</div>
          Post Details
        </h1>
      </div>

      <div className="content-area">
        <button 
          onClick={() => navigate(-1)}
          className="back-button"
        >
          ← Back to Posts
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
            <button className="action-btn" onClick={handleLike}>
              <span>❤️</span>
              <span className="like-count">{likes} likes</span>
            </button>
            <button className="action-btn">
              <span>💬</span>
              <span>{comments.length} comments</span>
            </button>
            <button className="action-btn">
              <span>📤</span>
              <span>Share</span>
            </button>
          </div>

          <div className="comments-section">
            <h3 className="comments-title">💬 Comments ({comments.length})</h3>
            
            {comments.length === 0 ? (
              <p className="no-comments">No comments yet. Be the first to comment!</p>
            ) : (
              <div className="comments-list">
                {comments.map(comment => (
                  <div key={comment.commentId} className="comment">
                    <div className="comment-header">
                      <span className="comment-user">User {comment.userId}</span>
                      <span className="comment-date">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="comment-content">{comment.content}</div>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleCommentSubmit} className="comment-form">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your comment..."
                className="comment-input"
                rows="3"
              />
              <button 
                type="submit" 
                className="comment-submit"
                disabled={!newComment.trim()}
              >
                Post Comment
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}