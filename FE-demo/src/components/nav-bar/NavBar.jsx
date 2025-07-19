import React from "react";
import { useUser } from "../../userContext/userContext";
import "./NavBar.css";
import { Link } from "react-router-dom";

function NavBar() {
  /* const { user } = useUser(); */
  const { user } = useUser();

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
          {user?.role === "MEMBER" && <Link to="/dashboard">Dashboard</Link>}
          {user?.role === "COACH" && (
            <Link to="/coach-dashboard">Coach Panel</Link>
          )}
          {user?.role === "ADMIN" && <Link to="/admin">Admin</Link>}
          <Link to="/home">Home </Link>
          <Link to="/blog">Blog</Link>
          <Link to="/membership">Membership</Link>
          <Link to="/feedback">Feedback</Link>
          <Link to="/about">AboutUs</Link>
        </div>
        {/* Right: Auth */}
        <div className="navbar-right">
          {user ? (
            <span className="navbar-user">👤 {user.username}</span>
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
