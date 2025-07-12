import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import api from '../../configs/axios';
import PostCard from './PostCard';
import './BlogApp.css';
import { Navbar } from '../../components/home/homePage';

export default function BlogApp() {
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({
    activeMembers: 0,
    postsThisWeek: 0,
    totalPosts: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Recent');

  const user = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();

  const handleCreatePost = () => {
    navigate('/blog/new');
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch posts
        const postsResponse = await api.get('/posts');
        const postsData = postsResponse.data.data;

        // Fetch statistics
        const statsResponse = await api.get('/posts/stats');
        setStats({
          activeMembers: statsResponse.data.data.activeMembers || 0,
          postsThisWeek: statsResponse.data.data.postsThisWeek || 0,
          totalPosts: statsResponse.data.data.totalPosts || 0
        });

        setPosts(postsData);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      {!user && <Navbar />}
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
              <div key={post.postId} className="post-section">
                <PostCard post={post} />
              </div>
            ))
          )}
        </div>

        <button className="floating-action" onClick={handleCreatePost}>
          ✏️
        </button>
      </div>
    </>
  );
}