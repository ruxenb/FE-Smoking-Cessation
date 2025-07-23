import React from "react";
import { useUser } from "../../userContext/userContext";
import "./NavBar.css";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { IoMenu } from "react-icons/io5";
import { LuBell, LuMessageCircleMore } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa";

function NavBar() {
  const { user } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const Icon = ({ children }) => (
    <div className="icon-placeholder">{children}</div>
  );

  return (
    <div className="navbar-container">
      <nav className="navbar">
        {/* Left: Logo + Tên */}
        <div className="navbar-left">
          <Link to="/home" className="navbar-logo">
            <img
              src="/images/official_logo.png"
              alt="Site Logo"
              className="site-logo"
            />
            <span className="site-name">Anti Smoking</span>
          </Link>
        </div>
        {/* Middle: Navigation Links */}
        <div className="navbar-middle">
          <Link to="/home">Home </Link>
          {user?.role === "MEMBER" && <Link to="/dashboard">Dashboard</Link>}
          {user?.role === "COACH" && (
            <Link to="/coach-dashboard">Coach Panel</Link>
          )}
          {user?.role === "ADMIN" && <Link to="/admin">Admin</Link>}
          <Link to="/blog">Blog</Link>
          <Link to="/membership">Membership</Link>
          <Link to="/feedback">Feedback</Link>
          <Link to="/about">AboutUs</Link>
        </div>
        {/* Right: Auth */}
        <div className="navbar-right">
          {user ? (
            <>
              <Link to="/profile" className="navbar_icon_button">
                <FaRegUser />
              </Link>
              {/* notification */}
              <Link to="/notifications" className="navbar_icon_button">
                <LuBell />
              </Link>
              {/* Nút tin nhắn */}
              <Link to="/messages" className="navbar_icon_button">
                <LuMessageCircleMore />
              </Link>
              <div className="user-dropdown" ref={dropdownRef}>
                <div
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="navbar-user"
                >
                  <Icon>
                    <IoMenu />
                  </Icon>
                </div>
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <Link to="/profile">Profile</Link>
                    <Link to="/settings">Settings</Link>
                    <Link to="/logout">Logout</Link>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/register">Register</Link>
              <Link to="/login" className="navbar-button">
                Login
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}

export default NavBar;
