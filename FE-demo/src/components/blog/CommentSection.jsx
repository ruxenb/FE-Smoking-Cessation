import React, { useState, useEffect } from 'react';
import api from '../../configs/axios';

export default function CommentSection({ postId, userId }) {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/post/${postId}`);
      setComments(res.data.data);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    try {
      setLoading(true);
      await api.post(`/comments`, { postId, userId, content: input });
      setInput("");
      await fetchComments();
    } catch (err) {
      console.error("Failed to post comment", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
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

      {userId && (
        <form onSubmit={handleComment} className="comment-form">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write your comment..."
            className="comment-input"
            rows="3"
            disabled={loading}
          />
          <button 
            type="submit" 
            className="comment-submit"
            disabled={!input.trim() || loading}
          >
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      )}
    </div>
  );
}