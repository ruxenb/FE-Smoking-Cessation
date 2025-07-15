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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(2);
  const [activeTab, setActiveTab] = useState('Recent'); // 'Admin' or 'Mine'

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

  // Filtering
  let filteredPosts = posts;

  if (activeTab === 'Admin') {
    filteredPosts = posts.filter(post => post.userId === 3); // Replace 3 with your admin userId
  } else if (activeTab === 'Mine') {
    filteredPosts = user ? posts.filter(post => post.userId === user.userId) : [];
  } else if (activeTab === 'Popular') {
    filteredPosts = [...posts].sort((a, b) => (b.likes || 0) - (a.likes || 0));
  } else if (activeTab === 'Recent') {
    filteredPosts = [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // Pagination
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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
              onClick={() => { setActiveTab('Recent'); setCurrentPage(1); }}
            >
              Recent
            </button>
            <button
              className={`filter-tab ${activeTab === 'Popular' ? 'active' : ''}`}
              onClick={() => { setActiveTab('Popular'); setCurrentPage(1); }}
            >
              Popular
            </button>
            <button
              className={`filter-tab ${activeTab === 'Admin' ? 'active' : ''}`}
              onClick={() => { setActiveTab('Admin'); setCurrentPage(1); }}
            >
              Notice
            </button>
            <button
              className={`filter-tab ${activeTab === 'Mine' ? 'active' : ''}`}
              onClick={() => { setActiveTab('Mine'); setCurrentPage(1); }}
              disabled={!user}
            >
              Mine
            </button>
          </div>

          <button className="new-post-btn" onClick={handleCreatePost}>
            ✨ Share Your Journey
          </button>

          {paginatedPosts.length === 0 ? (
            <div className="no-posts">No posts available yet.</div>
          ) : (
            paginatedPosts.map(post => (
              <div key={post.postId} className="post-section">
                <PostCard post={post} />
              </div>
            ))
          )}

          {/* Pagination Controls */}
          <div className="pagination-bar">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="pagination-info">
              Page {currentPage} of {Math.ceil(filteredPosts.length / pageSize)}
            </span>
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredPosts.length / pageSize), p + 1))}
              disabled={currentPage === Math.ceil(filteredPosts.length / pageSize) || filteredPosts.length === 0}
            >
              Next
            </button>
          </div>
        </div>

        <button className="floating-action" onClick={handleCreatePost}>
          ✏️
        </button>
      </div>
    </>
  );
}