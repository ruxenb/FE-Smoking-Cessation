// --- START OF NEW FILE SettingsPage.jsx ---

import React from 'react';

function SettingsPage({ currentTheme, onThemeChange }) {
  return (
    <div className="main-content">
      <header className="main-header">
        <div className="welcome-message">
          <h1>Settings</h1>
          <p>Customize your experience and manage your account.</p>
        </div>
      </header>

      {/* --- Appearance Section --- */}
      <section className="settings-section">
        <h2 className="settings-section-title">Appearance</h2>
        <div className="settings-card">
          <p className="setting-label">Theme</p>
          <p className="setting-description">
            Choose how QuitSmoke looks to you. Select a theme below.
          </p>
          <div className="theme-switcher">
            <button 
              className={`theme-option ${currentTheme === 'light' ? 'active' : ''}`}
              onClick={() => onThemeChange('light')}>
              ☀️ Light
            </button>
            <button 
              className={`theme-option ${currentTheme === 'dark' ? 'active' : ''}`}
              onClick={() => onThemeChange('dark')}>
              🌙 Dark
            </button>
          </div>
        </div>
      </section>
      
      {/* --- Profile Section --- */}
      <section className="settings-section">
        <h2 className="settings-section-title">Profile</h2>
        <div className="settings-card">
          <form className="overlay-form">
            <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" defaultValue="Alex" />
            </div>
            <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" defaultValue="alex@example.com" />
            </div>
            <div className="form-actions">
                <button type="submit" className="overlay-button">Save Changes</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default SettingsPage;