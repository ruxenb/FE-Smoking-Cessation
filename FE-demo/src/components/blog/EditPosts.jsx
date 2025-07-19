import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../configs/api/axios";
import "./BlogApp.css";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setUser(null);
      setLoading(false);
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/posts/${id}`);
        setPost({
          title: res.data.data.title,
          content: res.data.data.content,
        });
        setIsOwner(parsedUser.userId === res.data.data.userId);
      } catch (err) {
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !isOwner) return;

    try {
      setLoading(true);
      await api.put(`/posts/${id}`, { ...post, userId: user.id });
      navigate("/blog");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update post");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="post-form loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="post-form">
        <h2>Edit Post</h2>
        <div className="error-message">Please login to edit posts</div>
        <button
          className="auth-redirect-btn"
          onClick={() => navigate("/login")}
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="post-form">
        <h2>Edit Post</h2>
        <div className="error-message">You can only edit your own posts</div>
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back to Post
        </button>
      </div>
    );
  }

  return (
    <div className="post-form">
      <div className="post-form-header">
        <h2>Edit Your Post</h2>
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Cancel
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
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
            {loading ? "Updating..." : "Update Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
