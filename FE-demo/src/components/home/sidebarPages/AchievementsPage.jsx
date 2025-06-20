// --- START OF NEW FILE AchievementsPage.jsx ---

import React from 'react';
import AchievementCard from '../../home/AchievementCard';
import '../../home/homePage.css'; // Using the same CSS file for consistency

function AchievementsPage() {
  const timeBasedAchievements = [
    { name: "First 24 Hours", icon: "🏅", locked: false },
    { name: "Three-Day Trial", icon: "🏅", locked: false },
    { name: "Week One Warrior", icon: "🏅", locked: false },
    { name: "Fortnight Feat", icon: "🔒", locked: true },
    { name: "30-Day Milestone", icon: "🔒", locked: true },
    { name: "Quarterly Quit", icon: "🔒", locked: true },
    { name: "Half-Year Hero", icon: "🔒", locked: true },
    { name: "One Year Legend", icon: "🔒", locked: true },
  ];

  const financialAchievements = [
    { name: "First $10 Saved", icon: "💰", locked: false },
    { name: "Money Saver ($100)", icon: "💰", locked: false },
    { name: "Money Saver ($500)", icon: "💰", locked: true },
    { name: "The $1k Club", icon: "💰", locked: true },
    { name: "Big Spender (Not!)", icon: "💰", locked: true },
  ];
  
  const healthAchievements = [
      { name: "Breathe Easy", icon: "❤️", locked: false, description: "24 hours smoke-free." },
      { name: "Nerve Ending Regrowth", icon: "❤️", locked: false, description: "48 hours smoke-free."},
      { name: "Heart Helper", icon: "❤️", locked: true, description: "Risk of heart attack decreases." },
      { name: "Lung Love", icon: "❤️", locked: true, description: "Lung function improves." },
  ];

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
          {timeBasedAchievements.map((ach, index) => (
            <AchievementCard key={`time-${index}`} {...ach} />
          ))}
        </div>
      </section>

      <section className="achievements-section">
        <div className="section-header">
          <h2>Financial Goals</h2>
        </div>
        <div className="achievements-grid">
          {financialAchievements.map((ach, index) => (
            <AchievementCard key={`financial-${index}`} {...ach} />
          ))}
        </div>
      </section>

      <section className="achievements-section">
        <div className="section-header">
          <h2>Health & Wellness</h2>
        </div>
        <div className="achievements-grid">
          {healthAchievements.map((ach, index) => (
            <AchievementCard key={`health-${index}`} {...ach} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default AchievementsPage;