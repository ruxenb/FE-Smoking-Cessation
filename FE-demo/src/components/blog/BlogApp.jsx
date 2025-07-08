import React, { useEffect, useState } from 'react';
import api from '../../configs/axios';
import PostCard from './PostCard';
import './BlogApp.css';

export default function BlogApp() {
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({
    activeMembers: 0,
    postsThisWeek: 0,
    totalPosts: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Recent');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch posts
        const postsResponse = await api.get('/posts');
        setPosts(postsResponse.data.data);
        
        // Fetch statistics
        const statsResponse = await api.get('/posts/stats');
        setStats({
          activeMembers: statsResponse.data.activeMembers || 0,
          postsThisWeek: statsResponse.data.postsThisWeek || 0,
          totalPosts: statsResponse.data.totalPosts || 0
        });
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLike = async (postId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("Please login to like posts");
        return;
      }
      
      await api.post(`/likes/like?postId=${postId}&userId=${user.id}`);
      // Refresh the likes count
      const updatedPosts = posts.map(post => {
        if (post.postId === postId) {
          return { ...post, likes: (post.likes || 0) + 1 };
        }
        return post;
      });
      setPosts(updatedPosts);
    } catch (err) {
      console.error("Failed to like post", err);
    }
  };

  const handleCreatePost = () => {
    // You would implement your post creation logic here
    alert('Create new post functionality would open here!');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="blog-container">
      <div className="header">
        <h1>
          <div className="header-icon">🌱</div>
          Green Blog
        </h1>
      </div>

      <div className="content-area">
        <div className="stats-bar">
          <div className="stat-item">
            <div className="stat-number">{stats.activeMembers.toLocaleString()}</div>
            <div className="stat-label">Active Members</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.postsThisWeek}</div>
            <div className="stat-label">Posts This Week</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.totalPosts.toLocaleString()}</div>
            <div className="stat-label">Total Posts</div>
          </div>
        </div>

        <div className="filter-tabs">
          <button 
            className={`filter-tab ${activeTab === 'Recent' ? 'active' : ''}`}
            onClick={() => setActiveTab('Recent')}
          >
            Recent
          </button>
          <button 
            className={`filter-tab ${activeTab === 'Popular' ? 'active' : ''}`}
            onClick={() => setActiveTab('Popular')}
          >
            Popular
          </button>
        </div>

        <button className="new-post-btn" onClick={handleCreatePost}>
          ✨ Share Your Journey
        </button>

        {posts.length === 0 ? (
          <div className="no-posts">No posts available yet.</div>
        ) : (
          posts.map(post => (
            <PostCard 
              key={post.postId}
              post={post}
              onLike={handleLike}
            />
          ))
        )}
      </div>

      <button className="floating-action" onClick={handleCreatePost}>
        ✏️
      </button>
    </div>
  );
}