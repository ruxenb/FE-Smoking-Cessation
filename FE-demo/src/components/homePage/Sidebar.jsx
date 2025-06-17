import React from 'react';

// No changes needed here, this is already well-structured.
function Sidebar({ isCollapsed, onToggle }) {
  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="logo">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          // This onClick event is crucial!
          onClick={onToggle}
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="white"/>
          <path d="M15.07 7.07L13.66 8.48l1.41 1.41-1.41 1.41-1.42-1.42L10.83 11.3l-1.41-1.41 1.41-1.41-1.41-1.41-1.42 1.41L6.58 7.07l1.41 1.41 1.42-1.41 1.41 1.41 1.42-1.41 1.41 1.41zM9 14h6v2H9v-2z" fill="white"/>
        </svg>
        <span>QuitSmoke</span>
      </div>
      <nav className="navigation">
        <a href="#" className="active">
          <span className="icon">🏠</span> <span>Dashboard</span>
        </a>
        <a href="#"><span className="icon">🏆</span> <span>Achievements</span></a>
        <a href="#"><span className="icon">💬</span> <span>Community</span></a>
        <a href="#"><span className="icon">📚</span> <span>Resources</span></a>
        <a href="#"><span className="icon">⚙️</span> <span>Settings</span></a>
      </nav>
    </aside>
  );
}

// Small correction: remove the conditional logic from the JSX text nodes.
// The CSS (`.sidebar.collapsed span`) will handle hiding them.
export default Sidebar;