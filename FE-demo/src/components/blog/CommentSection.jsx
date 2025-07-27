import React, { useEffect, useState } from "react";
import api from "../../configs/api/axios";
import { useUser } from "../../userContext/userContext";
import toast from 'react-hot-toast'; // Replace antd message
import "./BlogApp.css";

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  const { user } = useUser(); // <-- LẤY USER TỪ CONTEXT, KHÔNG QUA PROP

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
      await api.post("/comments", {
        postId,
        userId: user.userId,
        content: newComment,
      });
      setNewComment("");
      toast.success("Comment posted successfully!");
      fetchComments();
    } catch (err) {
      toast.error("Failed to post comment");
      console.error("Failed to post comment", err);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editContent.trim()) return;
    try {
      await api.put(`/comments/${editingComment}`, {
        content: editContent,
      });
      setEditingComment(null);
      setEditContent("");
      toast.success("Comment updated successfully!");
      fetchComments();
    } catch (err) {
      toast.error("Failed to update comment");
      console.error("Failed to edit comment", err);
    }
  };

  const handleDelete = async (commentId) => {
    // Custom toast confirmation
    toast((t) => (
      <div className="toast-confirm">
        <div className="toast-confirm-icon">⚠️</div>
        <div className="toast-confirm-content">
          <div className="toast-confirm-title">Delete Comment</div>
          <div className="toast-confirm-message">
            Are you sure you want to delete this comment? This action cannot be undone.
          </div>
        </div>
        <div className="toast-confirm-actions">
          <button
            className="toast-btn toast-btn-cancel"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
          <button
            className="toast-btn toast-btn-delete"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const token = `Bearer ${localStorage.getItem("accessToken")}`;
                await api.delete(`/comments/${commentId}`, {
                  headers: { Authorization: token },
                });
                toast.success("Comment deleted successfully!");
                fetchComments();
              } catch (err) {
                toast.error("Failed to delete comment");
                console.error("Failed to delete comment", err);
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'top-center',
      style: {
        background: 'transparent',
        boxShadow: 'none',
        padding: 0,
      }
    });
  };

  const handleReplySubmit = async (e, parentCommentId) => {
    e.preventDefault();
    if (!replyContent.trim() || !user) return;
    try {
      await api.post("/comments", {
        postId,
        userId: user.userId,
        content: replyContent,
        parentCommentId,
      });
      setReplyContent("");
      setReplyTo(null);
      toast.success("Reply posted successfully!");
      fetchComments();
    } catch (err) {
      toast.error("Failed to post reply");
      console.error("Failed to post reply", err);
    }
  };

  const nestComments = (comments) => {
    const map = {};
    const roots = [];

    comments.forEach((comment) => {
      map[comment.commentId] = { ...comment, replies: [] };

      if (comment.parentCommentId && map[comment.parentCommentId]) {
        map[comment.parentCommentId].replies.push(map[comment.commentId]);
      } else {
        roots.push(map[comment.commentId]);
      }
    });

    return roots;
  };

  const renderComment = (comment, depth = 0) => {
    const isOwner = user && user.userId === comment.userId;
    const isAdmin = user && user.role === "ADMIN";
    return (
      <div
        key={comment.commentId}
        className={`comment ${depth > 0 ? "is-reply" : ""}`}
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
              <button type="submit" className="save-edit">
                Save
              </button>
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
              {/* Chỉ chủ sở hữu mới được SỬA */}
              {isOwner && (
                <button
                  className="edit-btn"
                  onClick={() => {
                    setEditingComment(comment.commentId);
                    setEditContent(comment.content);
                  }}
                >
                  
                </button>
              )}

              {/* Chủ sở hữu HOẶC Admin đều được XÓA */}
              {(isOwner || isAdmin) && (
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(comment.commentId)}
                >
                  🗑
                </button>
              )}

              {/* Bất kỳ người dùng nào đăng nhập cũng có thể TRẢ LỜI */}
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
            {comment.replies.map((reply) => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const nestedComments = nestComments(comments);

  return (
    <div className="comments-section">
      <h3 className="comments-title">💬 Comments ({comments.length})</h3>

      {comments.length === 0 ? (
        <p className="no-comments">No comments yet. Be the first to comment!</p>
      ) : (
        <div className="comments-list">
          {nestedComments.map((comment) => renderComment(comment))}
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
