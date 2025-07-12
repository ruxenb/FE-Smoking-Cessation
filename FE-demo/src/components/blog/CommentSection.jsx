import React, { useEffect, useState } from 'react';
import api from '../../configs/axios';
import './BlogApp.css';

export default function CommentSection({ postId, user }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/post/${postId}`);
      setComments(res.data.data);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    try {
      await api.post('/comments', {
        postId,
        userId: user.userId,
        content: newComment
      });
      setNewComment('');
      fetchComments();
    } catch (err) {
      console.error("Failed to post comment", err);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editContent.trim()) return;
    try {
      await api.put(`/comments/${editingComment}`, {
        content: editContent
      });
      setEditingComment(null);
      setEditContent('');
      fetchComments();
    } catch (err) {
      console.error("Failed to edit comment", err);
    }
  };

  const handleDelete = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await api.delete(`/comments/${commentId}`);
        fetchComments();
      } catch (err) {
        console.error("Failed to delete comment", err);
      }
    }
  };

  const handleReplySubmit = async (e, parentCommentId) => {
    e.preventDefault();
    if (!replyContent.trim() || !user) return;
    try {
      await api.post('/comments', {
        postId,
        userId: user.userId,
        content: replyContent,
        parentCommentId
      });
      setReplyContent('');
      setReplyTo(null);
      fetchComments();
    } catch (err) {
      console.error("Failed to post reply", err);
    }
  };

  const nestComments = (comments) => {
    const map = {};
    const roots = [];
    
    comments.forEach(comment => {
      map[comment.commentId] = { ...comment, replies: [] };
      
      if (comment.parentCommentId && map[comment.parentCommentId]) {
        map[comment.parentCommentId].replies.push(map[comment.commentId]);
      } else {
        roots.push(map[comment.commentId]);
      }
    });
    
    return roots;
  };

  const renderComment = (comment, depth = 0) => (
    <div 
      key={comment.commentId} 
      className={`comment ${depth > 0 ? 'is-reply' : ''}`}
      style={{ marginLeft: `${depth * 24}px` }}
    >
      <div className="comment-header">
        <span className="comment-user">User {comment.userId}</span>
        <span className="comment-date">
          {new Date(comment.createdAt).toLocaleDateString()}
        </span>
      </div>
      
      {editingComment === comment.commentId ? (
        <form onSubmit={handleEditSubmit} className="edit-form">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows="3"
            required
            autoFocus
          />
          <div className="comment-actions">
            <button type="submit" className="save-edit">Save</button>
            <button 
              type="button" 
              className="cancel-edit"
              onClick={() => setEditingComment(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="comment-content">{comment.content}</div>
          
          <div className="comment-controls">
            {user?.userId === comment.userId && (
              <>
                <button
                  className="edit-btn"
                  onClick={() => {
                    setEditingComment(comment.commentId);
                    setEditContent(comment.content);
                  }}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(comment.commentId)}
                >
                  Delete
                </button>
              </>
            )}
            
            {user && (
              <button
                className="reply-btn"
                onClick={() => setReplyTo(comment.commentId)}
              >
                Reply
              </button>
            )}
          </div>
        </>
      )}
      
      {replyTo === comment.commentId && (
        <form 
          onSubmit={(e) => handleReplySubmit(e, comment.commentId)}
          className="reply-form"
        >
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write your reply..."
            rows="2"
            required
          />
          <div className="reply-actions">
            <button type="submit" className="submit-reply">
              Post Reply
            </button>
            <button 
              type="button" 
              className="cancel-reply"
              onClick={() => setReplyTo(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      
      {comment.replies?.length > 0 && (
        <div className="replies-container">
          {comment.replies.map(reply => renderComment(reply, depth + 1))}
        </div>
      )}
    </div>
  );

  const nestedComments = nestComments(comments);

  return (
    <div className="comments-section">
      <h3 className="comments-title">💬 Comments ({comments.length})</h3>
      
      {comments.length === 0 ? (
        <p className="no-comments">No comments yet. Be the first to comment!</p>
      ) : (
        <div className="comments-list">
          {nestedComments.map(comment => renderComment(comment))}
        </div>
      )}
      
      {user && (
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment..."
            rows="3"
            required
          />
          <button 
            type="submit" 
            className="submit-comment"
            disabled={!newComment.trim()}
          >
            Post Comment
          </button>
        </form>
      )}
    </div>
  );
}