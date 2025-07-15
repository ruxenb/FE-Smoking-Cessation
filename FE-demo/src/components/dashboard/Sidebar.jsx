import React from "react";
import { CgLogOut } from "react-icons/cg";
import { useUser } from "../../userContext/userContext";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";

// No changes needed here, this is already well-structured.
function Sidebar({ isCollapsed, onToggle, currentPage, setCurrentPage }) {
  const { logout } = useUser(); // gọi hàm logout từ đối tượng UserContext trả về của useUser
  const navigate = useNavigate();

  // Helper to create navigation links
  // NavLink là một component được định nghĩa bên trong component SideBar

  const NavLink = ({ page, icon, label }) => (
    <a
      href="#"
      className={currentPage === page ? "active" : ""}
      /*  */
      onClick={(e) => {
        e.preventDefault(); // ngăn không cho thẻ <a> reload khi click
        setCurrentPage(page); // cập nhật lại currentPage trong Sidebar, để biết người dùng đang ở trang nào
      }}
    >
      <span className="icon">{icon}</span> <span>{label}</span>
    </a>
  );

  /* Hàm xử lý khi nhấn logout từ sidebar */
  const handleLogout = () => {
    if (window.confirm("Do you really want to logout?")) {
      logout();
      navigate("/login");
    }
  };

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
          style={{ cursor: "pointer", padding: "8px" }} // Added padding to make it look less cramped
        >
          <path
            d="M4 6H20M4 12H20M4 18H20"
            stroke="currentColor" // This will inherit the white color from the sidebar's CSS
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>QuitSmoke</span>
      </div>
      {/* <nav className="navigation">
        <a href="#" className="active">
          <span className="icon">🏠</span> <span>Dashboard</span>
        </a>
        <a href="#"><span className="icon">🏆</span> <span>Achievements</span></a>
        <a href="#"><span className="icon">💬</span> <span>Community</span></a>
        <a href="#"><span className="icon">📚</span> <span>Resources</span></a>
        <a href="#"><span className="icon">⚙️</span> <span>Settings</span></a>
      </nav> */}
      {/* --- CHANGED: Use the NavLink component for each navigation item --- */}
      <nav className="navigation">
        <NavLink page="home" icon="🏠" label="Home" />
        <NavLink page="dashboard" icon="📊" label="Dashboard" />
        <NavLink page="achievements" icon="🏆" label="Achievements" />
        <NavLink page="community" icon="🤝" label="Community" />
        <NavLink page="resources" icon="📚" label="Resources" />
        <NavLink page="chat" icon="💬" label="Chat" /> {/* <-- Add this line */}
        <NavLink page="settings" icon="⚙️" label="Settings" />

        <div className="sidebar-footer">
          <a href="#" className="logout-button" onClick={handleLogout}>
            <span className="icon">
              <CgLogOut />
            </span>{" "}
            <span>Logout</span>
          </a>
        </div>
      </nav>
    </aside>
  );
}

// Small correction: remove the conditional logic from the JSX text nodes.
// The CSS (`.sidebar.collapsed span`) will handle hiding them.
export default Sidebar;
