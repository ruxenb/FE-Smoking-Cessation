import React from "react";
import "./membership.css";
import { Link } from "react-router-dom";
import MemberCard from "./memberCards";


const logoUrl = 'https://i.pravatar.cc/40?img=1'; // ảnh chờ cho logo project


const Navbar = () => {
  return (
    <div className="navbar-container">
      <nav className="navbar">
        <a href="/">
          <div className="navbar-left">
        
              <img src={logoUrl} alt="Site Logo" className="logo-img" />
                  
            <Link to="/" className="site-name">NicoClear</Link>
          </div>
        </a>
        <div className="navbar-right">

          <a href="login" className="navbar-button">Login</a>

        </div>
      </nav>
    </div>
  );
};


function Membership({ userSubscription }) {
  const renderCtaButton = (planType) => {
  // Nếu user là GUEST  (not logged in, no subscription)
  // Giả sử  'userSubscription' là null chỉ ra 1 guest
  if (!userSubscription) {
    if (planType === 'basic') {
      return (
        <Link to="/register" className={`cta-button ${planType}-cta`}>
          Start now
        </Link>
      );
    } else if (planType === 'advanced') {
      // For guests, Advanced plan goes directly to checkout
      return (
        <Link to="/checkout/advanced" className={`cta-button ${planType}-cta`}>
          Sign Up for Advanced
        </Link>
      );
    }
  }
    if (userSubscription === planType) {
      return (
        <button className="cta-button current-usage-button" disabled>
          Currently Using
        </button>
      );
    } else if (userSubscription === 'advanced' && planType === 'basic') {
        return (
            <button className="cta-button current-usage-button" disabled>
              Downgrade (Not Recommended)
            </button>
        );
    } else {
      const linkPath = `/signup/${planType}`;
      const buttonText = planType === 'basic' ? 'Start now' : 'Upgrade now';
      return (
        <Link to={linkPath} className={`cta-button ${planType}-cta`}>
          {buttonText}
        </Link>
      );
    }
  };

  return (
    <>

      <Navbar />
      {/* Header Section */}
      <div className="page-header">
        <h1>Succeed in quitting smoking with us</h1>
        <p>Choose the right membership plan for you to achieve your smoking cessation goals.</p>
      </div>

      {/* Membership Cards Wrapper - Render the MemberCard component and pass props */}
      <MemberCard userSubscription={userSubscription} renderCtaButton={renderCtaButton} />

      {/* Compare Table Section */}
      <div className="compare-table-section">
        <h2>Compare Plans</h2>
        <p>See the detailed differences between the Basic and Advanced plans to choose what suits you best.</p>
        <div className="compare-table-container">
          <table>
            <thead>
              <tr>
                <th>Feature</th>
                <th>Basic</th>
                <th>Advanced</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Personal profile management</td><td><span className="icon-check">✔</span></td><td><span className="icon-check">✔</span></td></tr>
              <tr><td>Record smoking status</td><td><span className="icon-check">✔</span></td><td><span className="icon-check">✔</span></td></tr>
              <tr><td>Basic smoking cessation planning</td><td><span className="icon-check">✔</span></td><td><span className="icon-check">✔</span></td></tr>
              <tr><td>Record basic smoking cessation progress</td><td><span className="icon-check">✔</span></td><td><span className="icon-check">✔</span></td></tr>
              <tr><td>Receive motivational notifications</td><td><span className="icon-check">✔</span></td><td><span className="icon-check">✔</span></td></tr>
              <tr><td>View basic statistical information</td><td><span className="icon-check">✔</span></td><td><span className="icon-check">✔</span></td></tr>
              <tr className="highlight-row"><td>Advanced smoking cessation planning</td><td><span className="icon-x">✗</span></td><td><span className="icon-check">✔</span></td></tr>
              <tr className="highlight-row"><td>Record detailed smoking cessation progress</td><td><span className="icon-x">✗</span></td><td><span className="icon-check">✔</span></td></tr>
              <tr className="highlight-row"><td>Full statistics</td><td><span className="icon-x">✗</span></td><td><span className="icon-check">✔</span></td></tr>
              <tr className="highlight-row"><td>Receive full achievement badges</td><td><span className="icon-x">✗</span></td><td><span className="icon-check">✔</span></td></tr>
              <tr className="highlight-row"><td>Share badges on social media</td><td><span className="icon-x">✗</span></td><td><span className="icon-check">✔</span></td></tr>
              <tr className="highlight-row"><td>Live chat with a coach</td><td><span className="icon-x">✗</span></td><td><span className="icon-check">✔</span></td></tr>
              <tr className="highlight-row"><td>Assessment and feedback</td><td><span className="icon-x">✗</span></td><td><span className="icon-check">✔</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <h2>Frequently asked questions</h2>
        <div className="faq-item">
          <h3>How do I upgrade my account from Basic to Advanced?</h3>
          <p>You can upgrade your account anytime by clicking the "Upgrade now" button on the Advanced plan card. The system will guide you through the payment process.</p>
        </div>
        <div className="faq-item">
          <h3>What is the cancellation policy for the Advanced plan?</h3>
          <p>You can cancel your Advanced plan anytime from your account settings. The cancellation will be effective at the end of your current billing cycle.</p>
        </div>
        <div className="faq-item">
          <h3>If I cancel, will I lose my data?</h3>
          <p>No, your data will be retained. However, you will only have access to Basic plan features after your Advanced plan ends.</p>
        </div>
      </div>

      {/* Footer Section */}
      <footer>
        <p>&copy; 2025 [Your Company Name]. All rights reserved.</p>
        <p>
          <Link to="/terms">Terms of service</Link> |
          <Link to="/privacy">Privacy policy</Link>
        </p>
      </footer>
    </>
  );
}

export default Membership;