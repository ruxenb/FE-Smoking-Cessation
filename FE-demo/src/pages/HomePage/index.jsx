import React, { useState, useEffect } from 'react';

import Sidebar from '../../components/homePage/sidebar';
import MainContent from '../../components/homePage/homePage';

function App() {
 // State to manage whether the sidebar is collapsed or not
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Function to toggle the state
  const handleToggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Dynamically create the class string for the main container
  const containerClass = `app-container ${isCollapsed ? 'sidebar-collapsed' : ''}`;

  return (
    <div className={containerClass}>
      <Sidebar 
        isCollapsed={isCollapsed} 
        onToggle={handleToggleSidebar} 
      />

      {/* This is the new main grid cell that contains your content */}
      <div className="main-content-area">
        <MainContent />
      </div>
    </div>
  );
}

export default App;