import React from "react";
import StatCard from "./StatCard";
import AchievementCard from "./AchievementCard";
import CTASection from "./CTASection";
import "./dashboard.css";

function MainContent({ username, hasProfile, onCreateProfileClick, onEditProfileClick  }) {
  const moneySaved = "1,244.50";
  const lifeReclaimed = "28";
  const streakCount = "92";
  const cigsAvoided = "1,840";

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

       {/* --- HIỂN THỊ CÓ ĐIỀU KIỆN --- */}
      {/* Nếu CHƯA có profile, hiển thị prompt tạo mới */}
      {!hasProfile ? (
        <section className="profile-prompt-section">
          <p>Bắt đầu hành trình cai thuốc bằng cách tạo một hồ sơ cá nhân của bạn 😗</p>
          <button className="profile-prompt-button" onClick={onCreateProfileClick}>
            Tạo Hồ Sơ Hút Thuốc
          </button>
        </section>
      ) : (
        // Nếu ĐÃ có profile, hiển thị prompt cập nhật
        <section className="profile-prompt-section">
          <p>Hồ sơ của bạn đã sẵn sàng. Cập nhật nếu thói quen hút thuốc của bạn thay đổi.</p>
          <button className="profile-prompt-button" onClick={onEditProfileClick}>
            Cập Nhật Hồ Sơ
          </button>
        </section>
      )}


      <section className="stats-grid">
        {/*
          UPDATED: We now pass the 'iconClass' prop with our new CSS class names.
        */}
        <StatCard
          icon="💰"
          iconClass="card-icon--money"
          value={`$${moneySaved}`}
          label="Money Saved"
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
          label="Cigarettes Avoided"
        />
      </section>

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
