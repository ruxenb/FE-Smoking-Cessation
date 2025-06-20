import React, { useEffect, useState } from "react";

import Sidebar from "../../components/home/sidebar";
import MainContent from "../../components/home/homePage";
import SmokeSetupOverlay from "../../components/home/Overlay/SmokeSetup.jsx"
import AchievementsPage from '../../components/home/sidebarPages/AchievementsPage';
import SettingsPage from '../../components/home/sidebarPages/SettingsPage';

function App() {
  // State to manage whether the sidebar is collapsed or not
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');

   // State for theme management
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Effect to apply the theme to the body
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Function to toggle the state
  const handleToggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  // Dynamically create the class string for the main container
  const containerClass = `app-container ${isCollapsed ? "sidebar-collapsed" : ""
    }`;

  // State to track if the smoking profile exists.
  // In a real app, you would check this on page load.
  const [hasSmokingProfile, setHasSmokingProfile] = useState(false);

  // --- This is where you would check the user's status when the app loads ---
  useEffect(() => {
    // Example: fetch('/api/user/me/smoking-profile-status')
    //   .then(res => res.json())
    //   .then(data => setHasSmokingProfile(data.hasProfile));
    // For now, we'll keep it false to show the demo.
  }, []);

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
  };

   // Render the correct page based on state
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <MainContent />;
      case 'achievements':
        return <AchievementsPage />;
      case 'settings':
        return <SettingsPage currentTheme={theme} onThemeChange={setTheme} />;
      default:
        return <MainContent />;
    }
  };


  return (
    <div className={containerClass }>

      {/* 
        CONDITIONAL RENDERING:
        If the user does NOT have a smoking profile, show the overlay.
        We pass the 'handleSaveProfile' function to the component as a prop.
      */}
      {!hasSmokingProfile && showOverlay && (
        <SmokeSetupOverlay
          onSaveProfile={handleSaveProfile}
          onClose={handleCloseOverlay}
        />
      )}

      <Sidebar 
        isCollapsed={isCollapsed} 
        onToggle={handleToggleSidebar}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {/* This is the new main grid cell that contains your content */}
      <div className="main-content-area">
        {renderCurrentPage()}
      </div>
    </div>
  );
}

export default App;
