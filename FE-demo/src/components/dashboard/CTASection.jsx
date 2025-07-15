import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';


function CTASection() {
  const navigate = useNavigate();
  
  const handleNavigateToQuitPlan = () => {
    navigate('/quit-plan');
  };
  
  return (
    <section className="cta-section">
      <h2>Feeling a craving or want to log your progress?</h2>
      <p>Stay on track by checking in daily.</p>
      <button className="dashboard-cta-button" onClick={handleNavigateToQuitPlan}>
        Log Today's Progress
      </button>
    </section>
  );
}

export default CTASection;