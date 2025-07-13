import React, { useState, useEffect } from "react";
import { useUser } from "../../userContext/userContext";
import CoachSidebar from "../../components/coach/coachSidebar";
import CoachOverview from "../../components/coach/coachDashboard"; // <-- Component này sẽ được làm lại hoàn toàn
import MemberListPage from "../../components/coach/memberList"; // <-- Component này sẽ được cải tiến
import LeaderboardPage from "../../components/coach/leaderboard";
import CoachChatPage from "../../components/chat/CoachChatPage"; // <-- Component này sẽ được làm lại
// import ChatPlaceholder from "../../components/coach/ChatPlaceholder";
import SettingsPage from "../../components/dashboard/sidebarPages/SettingsPage";

import '../../components/dashboard/dashboard.css';

function CoachDashboard() {
  const { user } = useUser();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState("overview");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleToggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "overview":
        return <CoachOverview coachName={user?.fullName} />;
      case "members":
        return <MemberListPage />;
      case "chat":
        return <CoachChatPage coach={user} jwt={localStorage.getItem("accessToken")} />;
      case "leaderboard":
        return <LeaderboardPage />;
      case "settings":
        return <SettingsPage currentTheme={theme} onThemeChange={setTheme} />;
      default:
        return <CoachOverview coachName={user?.fullName} />;
    }
  };

  return (
    <div className={`app-container ${isCollapsed ? "sidebar-collapsed" : ""}`}>
      <CoachSidebar
        isCollapsed={isCollapsed}
        onToggle={handleToggleSidebar}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <div className="main-content-area">{renderCurrentPage()}</div>
    </div>
  );
}

export default CoachDashboard;