import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

function CTASection({ currentQuitPlan }) {
  const navigate = useNavigate();
  
  const handleNavigateToQuitPlan = () => {
    navigate('/quit-plan');
  };
  
  return (
    <section className={`cta-section ${currentQuitPlan ? 'hidden' : ''}`}>
      <h2>Ready? Create your quit plan!</h2>
      <p>Stay on track by checking in daily.</p>
      <button className="dashboard-cta-button" onClick={handleNavigateToQuitPlan}>
        Create
      </button>
    </section>
  );
}

export default CTASection;