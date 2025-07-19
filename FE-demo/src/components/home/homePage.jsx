import React from "react";
import "./homePage.css";
import { Link } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import NavBar from "../nav-bar/NavBar";

// component đơn giản cho icon
const Icon = ({ children }) => (
  <div className="icon-placeholder">{children}</div>
);

const HomePage = () => {
  return (
    <div className="homepage-container">
      
      <NavBar />

      {/* --- Hero Section --- */}
      <header className="hero-section">
        <div className="hero-layout">
          <div className="hero-left-column">
            <h1>
              <span className="highlight">
                <Typewriter
                  words={["Quit Smoking", "Live Longer"]}
                  loop={0} // 0 = không lặp
                  cursor
                  typeSpeed={80}
                  deleteSpeed={50}
                  delaySpeed={1000}
                />
              </span>
            </h1>
            <p className="subtitle">
              We are here for guiding you towards a healthier happier and better
              life
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="cta-button primary">
                Get Started For Free
              </Link>
              <Link to="/membership" className="cta-button outline">
                Membership
              </Link>
            </div>
          </div>

          {/* Right Column đang trống*/}
          <div className="hero-right-column">
            {/* Add hình trong tương lai */}
          </div>
        </div>
      </header>

      {/* --- Features Section --- */}
      <section id="features" className="homepage-section features-section">
        <h2>Everything You Need to Quit for Good</h2>
        <div className="features-grid">
          <div className="feature-card">
            <Icon>📊</Icon>
            <h3>Track Your Progress</h3>
            <p>
              Visualize your success. See your smoke-free days, money saved, and
              health improvements in real-time.
            </p>
          </div>
          <div className="feature-card">
            <Icon>🤝</Icon>
            <h3>Find Support</h3>
            <p>
              You're not alone. Connect with peers and professional coaches in
              our supportive community forum.
            </p>
          </div>
          <div className="feature-card">
            <Icon>🏆</Icon>
            <h3>Stay Motivated</h3>
            <p>
              Earn achievement badges for your milestones and share your
              progress to inspire yourself and others.
            </p>
          </div>
        </div>
      </section>

      {/* --- How It Works Section --- */}
      <section
        id="how-it-works"
        className="homepage-section how-it-works-section"
      >
        <h2>Get Started in Three Simple Steps</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Sign Up</h3>
            <p>
              Create your personal account in just a few clicks. It's free to
              start.
            </p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Make a Plan</h3>
            <p>
              Define your reasons for quitting and set your goals with our
              guided plan creator.
            </p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Live Freely</h3>
            <p>
              Engage with the community, track your wins, and build a healthier
              future.
            </p>
          </div>
        </div>
      </section>

      {/* --- About Us Section --- */}
      <section id="about" className="homepage-section about-section">
        <div className="about-content">
          <h2>About Our Mission</h2>
          <p>
            We believe that everyone deserves the chance to live a healthier,
            smoke-free life. Our mission is to empower individuals to overcome
            addiction by providing an accessible, supportive, and motivating
            digital environment. This platform combines evidence-based
            strategies with the power of community to create lasting change.
          </p>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="footer">
        <div className="footer-content">
          <p className="footer-title">Ready to begin?</p>
          <button className="cta-button secondary">
            Join the Community Today
          </button>
          <div className="footer-bottom">
            <p>
              © 2025 Smoking Cessation Support Platform. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
