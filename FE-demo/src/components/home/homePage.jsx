import React from 'react';
import './HomePage.css';

// component đơn giản cho icon
const Icon = ({ children }) => <div className="icon-placeholder">{children}</div>;
const logoUrl = 'https://i.pravatar.cc/40?img=1'; // ảnh chờ cho logo project
// --- NAVBAR COMPONENT ---
const Navbar = () => {
  return (
    <div className="navbar-container">
      <nav className="navbar">
        <div className="navbar-left">
          <img src={logoUrl} alt="Site Logo" className="logo-img" />
          <span className="site-name">Site name</span>
        </div>
        <div className="navbar-right">
          <a href="about">About us</a>
          <a href="membership">Membership</a>
          <a href="#blog">Blog</a>
          <a href="register" className="navbar-button">Get Started</a>
        </div>
      </nav>
    </div>
  );
};

const HomePage = () => {
  return (
    <div className="homepage-container">
      {/* Add the new Navbar component here */}
      <Navbar /> 
      {/* --- Hero Section --- */}
      <header className="hero-section">
        <div className="hero-content">
          <h1>Quit Strong. Live Long.</h1>
          <p className="subtitle">
            Guiding you towards a healthier, happier, smoke-free future.
          </p>
          <div className="hero-buttons">
            <button className="cta-button primary">Get Started For Free</button>
            <button className="cta-button outline">Membership</button>
          </div>
        </div>
      </header>

      {/* --- Features Section --- */}
      <section id="features" className="features-section">
        <h2>Everything You Need to Quit for Good</h2>
        <div className="features-grid">
          <div className="feature-card">
            <Icon>📊</Icon>
            <h3>Track Your Progress</h3>
            <p>Visualize your success. See your smoke-free days, money saved, and health improvements in real-time.</p>
          </div>
          <div className="feature-card">
            <Icon>🤝</Icon>
            <h3>Find Support</h3>
            <p>You're not alone. Connect with peers and professional coaches in our supportive community forum.</p>
          </div>
          <div className="feature-card">
            <Icon>🏆</Icon>
            <h3>Stay Motivated</h3>
            <p>Earn achievement badges for your milestones and share your progress to inspire yourself and others.</p>
          </div>
        </div>
      </section>
      
      {/* --- How It Works Section --- */}
      <section id="how-it-works" className="how-it-works-section">
        <h2>Get Started in Three Simple Steps</h2>
        <div className="steps-container">
            <div className="step">
                <div className="step-number">1</div>
                <h3>Sign Up</h3>
                <p>Create your personal account in just a few clicks. It's free to start.</p>
            </div>
            <div className="step">
                <div className="step-number">2</div>
                <h3>Make a Plan</h3>
                <p>Define your reasons for quitting and set your goals with our guided plan creator.</p>
            </div>
            <div className="step">
                <div className="step-number">3</div>
                <h3>Live Freely</h3>
                <p>Engage with the community, track your wins, and build a healthier future.</p>
            </div>
        </div>
      </section>

      {/* --- About Us Section --- */}
      <section id="about" className="about-section">
        <div className="about-content">
          <h2>About Our Mission</h2>
          <p>
            {/* You can replace this placeholder text with your actual "About Us" content. */}
            We believe that everyone deserves the chance to live a healthier, smoke-free life. Our mission is to empower individuals to overcome addiction by providing an accessible, supportive, and motivating digital environment. This platform combines evidence-based strategies with the power of community to create lasting change.
          </p>
        </div>
      </section>
      
      {/* --- Footer --- */}
      <footer className="footer">
        <div className="footer-content">
          <p className="footer-title">Ready to begin?</p>
          <button className="cta-button secondary">Join the Community Today</button>
          <div className="footer-bottom">
            <p>© 2024 Smoking Cessation Support Platform. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;