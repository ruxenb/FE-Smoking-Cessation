import React, { useEffect, useState } from 'react';
import { fetchAchievements } from '../../../services/achievementService'; // 👈 Gọi API từ file riêng
import AchievementCard from '../../dashboard/AchievementCard';
import '../../dashboard/dashboard.css';

function AchievementsPage() {
  const [achievements, setAchievements] = useState([]);
  const tokenType = localStorage.getItem("tokenType");
  const accessToken = localStorage.getItem("accessToken");
  const fullToken = tokenType && accessToken ? `${tokenType} ${accessToken}` : null;

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchAchievements(fullToken);
        setAchievements(res.data.data); // Dữ liệu nằm trong field `data`
      } catch (err) {
        console.error("Failed to load achievements:", err);
      }
    };

    loadData();
  }, []);

  const filterByCategory = (cat) =>
    achievements.filter(a => a.category === cat);

  return (
    <div className="main-content">
      <header className="main-header">
        <div className="welcome-message">
          <h1>Your Achievements</h1>
          <p>Track your incredible progress and unlock new milestones.</p>
        </div>
      </header>

      <section className="achievements-section">
        <div className="section-header">
          <h2>Time-Based Milestones</h2>
        </div>
        <div className="achievements-grid">
          {filterByCategory("time").map((ach, index) => (
            <AchievementCard key={`time-${index}`} {...ach} />
          ))}
        </div>
      </section>

      <section className="achievements-section">
        <div className="section-header">
          <h2>Financial Goals</h2>
        </div>
        <div className="achievements-grid">
          {filterByCategory("financial").map((ach, index) => (
            <AchievementCard key={`financial-${index}`} {...ach} />
          ))}
        </div>
      </section>

      <section className="achievements-section">
        <div className="section-header">
          <h2>Health & Wellness</h2>
        </div>
        <div className="achievements-grid">
          {filterByCategory("health").map((ach, index) => (
            <AchievementCard key={`health-${index}`} {...ach} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default AchievementsPage;
