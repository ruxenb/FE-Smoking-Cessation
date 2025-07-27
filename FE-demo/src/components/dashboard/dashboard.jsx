import React, { useEffect, useState } from "react";
import StatCard from "./StatCard";
import AchievementCard from "./AchievementCard";
import CTASection from "./CTASection";
import QuitProgressCard from "./QuitProgressCard";
import "./dashboard.css";
import { Link } from "react-router-dom";
import SmokingProfileInfo from "./smokeInfo";
import {
  fetchAchievements,
  fetchUserAchievementProgress
} from '../../services/achievementService';
import { useUser } from '../../userContext/userContext';

function MainContent({
  username,
  hasProfile,
  currentQuitPlan,
  smokingProfile,
}) {
  const [achievements, setAchievements] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useUser();
  const tokenType = localStorage.getItem("tokenType");
  const accessToken = localStorage.getItem("accessToken");
  const fullToken = tokenType && accessToken ? `${tokenType} ${accessToken}` : null;

  // Load achievements data
  useEffect(() => {
    const loadAchievements = async () => {
      if (!fullToken) return;

      try {
        setLoading(true);

        const [achievementsRes, progressRes] = await Promise.all([
          fetchAchievements(fullToken),
          user ? fetchUserAchievementProgress(user.userId, fullToken) : Promise.resolve({ data: { data: [] } })
        ]);

        setAchievements(achievementsRes.data.data);
        setUserProgress(progressRes.data.data);
      } catch (err) {
        console.error("Failed to load achievements:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAchievements();
  }, [user, fullToken]);

  // Get user progress for an achievement
  const getUserProgress = (achievementId) => {
    return userProgress.find(p => p.achievementId === achievementId);
  };

  // Get recent achievements (mix of unlocked and close to unlocking)
  const getRecentAchievements = () => {
    if (!achievements.length) return [];

    const achievementsWithProgress = achievements.map(ach => {
      const progress = getUserProgress(ach.achievementId);
      return {
        ...ach,
        progress,
        isEarned: progress?.earned || false,
        progressPercentage: progress?.progressPercentage || 0
      };
    });

    // Sort by: unlocked first, then by progress percentage (descending)
    const sorted = achievementsWithProgress.sort((a, b) => {
      if (a.isEarned && !b.isEarned) return -1;
      if (!a.isEarned && b.isEarned) return 1;
      return b.progressPercentage - a.progressPercentage;
    });

    // Return first 4 achievements
    return sorted.slice(0, 4);
  };

  const recentAchievements = getRecentAchievements();

  return (
    <main className="main-content">
      <header className="main-header">
        <div className="welcome-message">
          <h1>
            Welcome back, <span className="username">{username}</span>!
          </h1>
          <p>You're doing great. Keep up the amazing work.</p>
        </div>
        <div className="user-profile">
          <img
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${username}`}
            alt="User Avatar"
          />
        </div>
      </header>

      <SmokingProfileInfo smokingProfile={smokingProfile} />

      {/* Conditional Profile Section */}
      {!hasProfile ? (
        <section className="profile-prompt-section">
          <p>
            Start your quit-smoking journey by creating your personal profile 😗
          </p>
          <Link to="/smoking-quiz" className="profile-prompt-button">
            Create Smoking Profile
          </Link>
        </section>
      ) : (
        <section className="profile-prompt-section">
          <p>Your smoking profile is ready. Update it if your habits change.</p>
          <Link to="/smoking-quiz" className="profile-prompt-button">
            Update Smoking Profile
          </Link>
        </section>
      )}

      {/* Quit Progress Section */}
      <section className="quit-progress-section">
        {currentQuitPlan && (
          <QuitProgressCard
            quitplan={currentQuitPlan}
            fullToken={fullToken}
            costPerPack={smokingProfile?.costPerPack || 0}
          />
        )}
      </section>

      {/* Pass currentQuitPlan prop to CTASection */}
      <CTASection currentQuitPlan={currentQuitPlan} />

      {/* Recent Achievements Section */}
      <section className="achievements-section">
        <div className="section-header">
          <h2>Recent Achievements</h2>
          <Link to="/achievements" className="view-all">
            View All
          </Link>
        </div>

        {loading ? (
          <div className="achievements-loading">
            <p>Loading achievements...</p>
          </div>
        ) : recentAchievements.length > 0 ? (
          <div className="achievements-grid dashboard-achievements">
            {recentAchievements.map((achievement) => {
              const progress = getUserProgress(achievement.achievementId);
              return (
                <AchievementCard
                  key={achievement.achievementId}
                  achievementId={achievement.achievementId}
                  name={achievement.name}
                  icon={achievement.icon}
                  description={achievement.description}
                  category={achievement.category}
                  userProgress={progress}
                  isNewlyUnlocked={false} // No animations on dashboard
                />
              );
            })}
          </div>
        ) : (
          <div className="no-achievements">
            <p>🎯 Complete your smoking profile to start earning achievements!</p>
            {!hasProfile && (
              <Link to="/smoking-quiz" className="profile-prompt-button">
                Get Started
              </Link>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default MainContent;
