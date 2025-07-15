import React from "react";
import StatCard from "./StatCard";
import AchievementCard from "./AchievementCard";
import CTASection from "./CTASection";
import QuitProgressCard from "./QuitProgressCard";
import "./dashboard.css";
import { Link } from 'react-router-dom';
import SmokingProfileInfo from './smokeInfo'; // <-- BƯỚC 3.1: Import component mới


function MainContent({
  username,
  hasProfile,
  currentQuitPlan,
  smokingProfile, // <-- BƯỚC 3.2: Nhận smokingProfile làm prop
}) {
  // const moneySaved = "1,244.50";
  // const lifeReclaimed = "28";
  // const streakCount = "92";
  // const cigsAvoided = "1,840";
  const tokenType = localStorage.getItem("tokenType");
  const accessToken = localStorage.getItem("accessToken");
  const fullToken = tokenType && accessToken ? `${tokenType} ${accessToken}` : null;
  const achievements = [
    { name: "First 24 Hours", icon: "🏅", locked: false },
    { name: "Week One Warrior", icon: "🏅", locked: false },
    { name: "Money Saver ($100)", icon: "🏅", locked: false },
    { name: "30-Day Milestone", icon: "🔒", locked: true },
    { name: "Money Saver ($500)", icon: "🔒", locked: true },
  ];

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

      {/* --- HIỂN THỊ CÓ ĐIỀU KIỆN --- */}
      {/* Nếu CHƯA có profile, hiển thị prompt tạo mới */}
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
        // Nếu ĐÃ có profile, hiển thị prompt cập nhật
        <section className="profile-prompt-section">
          <p>Your profile is ready. Update it if your habits change.</p>
          <Link to="/smoking-quiz" className="profile-prompt-button">
            Update Smoking Profile
          </Link>
        </section>
      )}
      <section className="quit-progress-section">
        {currentQuitPlan && (
          <QuitProgressCard
            quitplan={currentQuitPlan}
            fullToken={fullToken}
            costPerPack={smokingProfile?.costPerPack || 0} // Truyền giá trị costPerPack từ smokingProfile
          />
        )}
      </section>

      {/* <section className="stats-grid">
        <StatCard
          icon="💰"
          iconClass="card-icon--money"
          value={`$${moneySaved}`}
          label="Total Money Saved"
        />
        <StatCard
          icon="❤️"
          iconClass="card-icon--health"
          value={`${lifeReclaimed} Days`}
          label="Life Reclaimed"
        />
        <StatCard
          icon="🔥"
          iconClass="card-icon--streak"
          value={`${streakCount} Days`}
          label="Current Streak"
        />
        <StatCard
          icon="🚭"
          iconClass="card-icon--avoided"
          value={cigsAvoided}
          label="Total Cigarettes Avoided"
        />
      </section> */}

      <section className="achievements-section">
        <div className="section-header">
          <h2>Recent Achievements</h2>
          <a href="#" className="view-all">
            View All
          </a>
        </div>
        <div className="achievements-grid">
          {achievements.map((achievement, index) => (
            <AchievementCard
              key={index}
              icon={achievement.icon}
              name={achievement.name}
              locked={achievement.locked}
            />
          ))}
        </div>
      </section>

      <CTASection />
    </main>
  );
}

export default MainContent;
