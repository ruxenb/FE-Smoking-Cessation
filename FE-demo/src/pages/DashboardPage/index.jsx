import React, { useEffect, useState } from "react";

import Sidebar from "../../components/dashboard/Sidebar.jsx";
import MainContent from "../../components/dashboard/dashboard.jsx";
import SmokeSetupOverlay from "../../components/dashboard/Overlay/SmokeSetup.jsx";
import AchievementsPage from "../../components/dashboard/sidebarPages/AchievementsPage.jsx";
import SettingsPage from "../../components/dashboard/sidebarPages/SettingsPage.jsx";

function Dashboard() {
  // State to manage whether the sidebar is collapsed or not
  const [isCollapsed, setIsCollapsed] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [showOverlay, setShowOverlay] = useState(true);
  const [currentPage, setCurrentPage] = useState("dashboard");
  // eslint-disable-next-line no-unused-vars
  const [username, setUsername] = useState("");

  
  const [isProfileOverlayVisible, setIsProfileOverlayVisible] = useState(false);

  //dùng để đổi theme
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Effect để apply theme
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleToggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // eslint-disable-next-line no-unused-vars
  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  // eslint-disable-next-line no-unused-vars
  const containerClass = `app-container ${
    isCollapsed ? "sidebar-collapsed" : ""
  }`;

  // State to track if the smoking profile exists.
  // In a real app, you would check this on page load.
  const [hasSmokingProfile, setHasSmokingProfile] = useState(false);

  // --- This is where you would check the user's status when the app loads ---
  useEffect(() => {
    // Example: fetch('/api/user/me/smoking-profile-status')
    //   .then(res => res.json())
    //   .then(data => setHasSmokingProfile(data.hasProfile));
    // Tạm thời để false để demo
   
  }, []);

  const openProfileOverlay = () => {
    setIsProfileOverlayVisible(true);
  };
  
  const closeProfileOverlay = () => {
    setIsProfileOverlayVisible(false);
  };

  const handleSaveProfile = (profileData) => {
    console.log("Data ready to be sent to backend:", profileData);

    // --- API CALL LOGIC GOES HERE ---
    // Example:
    // fetch('/api/smoking-profiles', { method: 'POST', body: JSON.stringify(profileData), ... })
    //  .then(response => {
    //    if (response.ok) {
    //      console.log('Profile saved!');
    //      setHasSmokingProfile(true); // Hide the overlay on success
    //    }
    //  })
    //  .catch(error => console.error('Failed to save profile', error));

    // For demonstration, we'll just simulate a successful save.
    setHasSmokingProfile(true);
    closeProfileOverlay();
  };

  // Render the correct page based on state
  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard" /* truy cập tới dashboard khi đăng nhập thành công, truyền data */:
        return <MainContent 
            hasProfile={hasSmokingProfile} 
            onCreateProfileClick={openProfileOverlay} onEditProfileClick={openProfileOverlay} />;
      case "achievements":
        return <AchievementsPage />;
      case "settings":
        return <SettingsPage currentTheme={theme} onThemeChange={setTheme} />;
      default:
        return <MainContent onEditProfileClick={openProfileOverlay} />;
    }
  };

  return (
    <div className={`app-container ${isCollapsed ? "sidebar-collapsed" : ""}`}>
      {/* --- SIMPLIFIED OVERLAY RENDERING --- */}
      {isProfileOverlayVisible && (
        <SmokeSetupOverlay
          onSaveProfile={handleSaveProfile}
          onClose={closeProfileOverlay}
        />
      )}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={handleToggleSidebar}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />


      {/* Định nghĩa khu vực chính hiển thị nội dung (giao diện chính), render nội dung giao diện dựa trên hàm renderCurrentPage() */}
      <div className="main-content-area">{renderCurrentPage()}</div>



    </div>
  );
}

export default Dashboard;
