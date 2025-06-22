import React from "react";
import { useNavigate } from "react-router-dom";

// No changes needed here, this is already well-structured.
function Sidebar({ isCollapsed, onToggle, currentPage, setCurrentPage }) {
  const navigate = useNavigate();

  // Helper to create navigation links
  const NavLink = ({ page, icon, label }) => (
    <a
      href="#"
      className={currentPage === page ? "active" : ""}
      onClick={(e) => {
        e.preventDefault(); // Prevent page reload
        setCurrentPage(page);
      }}
    >
      <span className="icon">{icon}</span> <span>{label}</span>
    </a>
  );

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="logo">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          onClick={onToggle}
          style={{ cursor: "pointer", padding: "8px" }}
        >
          <path
            d="M4 6H20M4 12H20M4 18H20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>QuitSmoke</span>
      </div>

      {/* Nội dung sidebar chia làm 2 phần: nav và logout */}
      <div
        className="sidebar-content"
        style={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        {/* Navigation links */}
        <nav className="navigation" style={{ flexGrow: 1 }}>
          <NavLink page="dashboard" icon="🏠" label="Dashboard" />
          <NavLink page="achievements" icon="🏆" label="Achievements" />
          <NavLink page="community" icon="💬" label="Community" />
          <NavLink page="resources" icon="📚" label="Resources" />
          <NavLink page="settings" icon="⚙️" label="Settings" />
          <NavLink
            page="logout" // không cần dùng trong setCurrentPage
            icon="🚪"
            label="Logout"
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          />
        </nav>

        {/* Logout button styled like nav item */}
        <div style={{ padding: "16px" }}>
          <NavLink
            page="logout" // không cần dùng trong setCurrentPage
            icon="🚪"
            label="Logout"
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          />
        </div>
      </div>
    </aside>
  );
}

// Small correction: remove the conditional logic from the JSX text nodes.
// The CSS (`.sidebar.collapsed span`) will handle hiding them.
export default Sidebar;
