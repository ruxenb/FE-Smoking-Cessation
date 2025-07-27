import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../configs/api/axios";
import toast, { Toaster } from 'react-hot-toast';
import "./BlogApp.css";

export default function CreatePost() {
  const navigate = useNavigate();
  const [post, setPost] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return (
      <div className="post-form">
        <h2>Create Post</h2>
        <div className="error-message">Please login to create posts</div>
        <button
          className="auth-redirect-btn"
          onClick={() => navigate("/login")}
        >
          Go to Login
        </button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!post.title.trim()) {
      toast.error("Title cannot be blank");
      return;
    }

    if (post.title.length < 2 || post.title.length > 255) {
      toast.error("Title must be between 2 and 255 characters");
      return;
    }

    if (!post.content.trim()) {
      toast.error("Content cannot be blank");
      return;
    }

    try {
      setLoading(true);
      await api.post("/posts", { ...post, userId: user.userId });
      toast.success("Post created successfully!");
      navigate("/blog");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="post-form">
        <div className="post-form-header">
          <h2>Create Post</h2>
          <button className="back-button" onClick={() => navigate("/blog")}>
            ← Cancel
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Your Story</label>
            <textarea
              value={post.content}
              onChange={(e) => setPost({ ...post, content: e.target.value })}
              rows="10"
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Publishing..." : "Publish Post"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
