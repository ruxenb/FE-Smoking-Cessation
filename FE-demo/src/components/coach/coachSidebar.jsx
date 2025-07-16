
import React from "react";
import { CgLogOut } from "react-icons/cg";
import { useUser } from "../../userContext/userContext";
import { useNavigate } from "react-router-dom";

function CoachSidebar({ isCollapsed, onToggle, currentPage, setCurrentPage }) {
  const { logout } = useUser();
  const navigate = useNavigate();

  const NavLink = ({ page, icon, label }) => (
    <a
      href="#"
      className={currentPage === page ? "active" : ""}
      onClick={(e) => {
        e.preventDefault();
        setCurrentPage(page);
      }}
    >
      <span className="icon">{icon}</span> <span>{label}</span>
    </a>
  );

  const handleLogout = () => {
    if (window.confirm("Do you really want to logout?")) {
      logout();
      navigate("/login");
    }
  };

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="logo" onClick={onToggle} style={{ cursor: "pointer" }}>
        <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={onToggle} // Gán sự kiện onToggle cho nút hamburger
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
        {/* Tên/Logo của khu vực Coach */}
        <span>Coach Panel</span>
      </div>
      <nav className="navigation">
        <NavLink page="overview" icon="📊" label="Overview" />
        <NavLink page="members" icon="👥" label="My Members" />
        <NavLink page="chat" icon="💬" label="Chat" />
        <NavLink page="leaderboard" icon="🏆" label="Leaderboard" />
        <NavLink page="settings" icon="⚙️" label="Settings" />

        <div className="sidebar-footer">
          <a href="#" className="logout-button" onClick={handleLogout}>
            <span className="icon"><CgLogOut /></span>
            <span>Logout</span>
          </a>
        </div>
      </nav>
    </aside>
  );
}

export default CoachSidebar;