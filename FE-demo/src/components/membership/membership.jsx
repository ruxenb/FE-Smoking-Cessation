import React from "react";
import "./membership.css";
import { Link } from "react-router-dom";
import MemberCard from "./memberCards";
import { useUser } from "../../userContext/userContext";

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


function Membership() {
  const { user } = useUser(); // Lấy thông tin user từ context

  if (user) {
  console.log("Membership data:", user.membership);
} else {
  console.log("Chưa đăng nhập hoặc user bị null.");
}


  // Xác định trạng thái của người dùng: 'guest', 'basic', hoặc 'advanced'
  let subscriptionStatus = 'guest';
  if (user) {
    // Nếu user đã đăng nhập, kiểm tra xem có thông tin gói thành viên không
    if (user.membership && user.membership.status === 'ACTIVE') {
    subscriptionStatus = 'advanced';
    } else {
      // Đã đăng nhập nhưng không có gói active => coi là 'basic'
      subscriptionStatus = 'basic';
    }
  }else {
    // Nếu user là null => chưa đăng nhập
    subscriptionStatus = 'guest';
  }
  const renderCtaButton = (planType) => {
  // Nếu user là GUEST  (not logged in, no subscription)
  // Giả sử  'userSubscription' là null chỉ ra 1 guest
  switch (subscriptionStatus) {
      // --- TRƯỜNG HỢP 1: KHÁCH (CHƯA ĐĂNG NHẬP) ---
      case 'guest':
        if (planType === 'basic') {
          return (
            <Link to="/register" className="cta-button basic-cta">
              Start Now
            </Link>
          );
        }
        if (planType === 'advanced') {
          // ProtectedRoute sẽ tự động chuyển hướng đến /login trước, rồi mới tới checkout
          return (
            <Link to="/checkout/advanced" className="cta-button advanced-cta">
              Sign Up for Advanced
            </Link>
          );
        }
        break;

      // --- TRƯỜNG HỢP 2: USER CÓ GÓI BASIC (HOẶC KHÔNG CÓ GÓI NÀO) ---
      case 'basic':
        if (planType === 'basic') {
          return (
            <button className="cta-button current-usage-button" disabled>
              Currently Using
            </button>
          );
        }
        if (planType === 'advanced') {
          return (
            <Link to="/checkout/advanced" className="cta-button advanced-cta">
              Upgrade Now
            </Link>
          );
        }
        break;

      // --- TRƯỜNG HỢP 3: USER CÓ GÓI ADVANCED ---
      case 'advanced':
        if (planType === 'basic') {
          return (
            <button className="cta-button current-usage-button" disabled>
              Downgrade Not Available
            </button>
          );
        }
        if (planType === 'advanced') {
          return (
            <button className="cta-button current-usage-button" disabled>
              Currently Using
            </button>
          );
        }
        break;
      
      default:
        return null;
    }
  };

  return (
    <div className="membership-page">

      <Navbar />
      {/* Header Section */}
      <div className="page-header">
        <h1>Succeed in quitting smoking with us</h1>
        <p>Choose the right membership plan for you to achieve your smoking cessation goals.</p>
      </div>

      {/* Truyền hàm renderCtaButton xuống cho MemberCard */}
      <MemberCard renderCtaButton={renderCtaButton} />

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
    </div>
  );
}

export default Membership;