import React from "react";
import { Link } from "react-router-dom";

function memberCard({ userSubscription, renderCtaButton }){
    return(
        <>

      {/* Membership Cards Wrapper */}
      <div className="membership-cards-wrapper">
        {/* Basic Plan Card */}
        <div className="membership-card basic-plan">
          <h2>Basic</h2>
          <p className="price">Free</p>
          <div className="card-content-wrapper">
            <p className="description">Start your smoking cessation journey with basic features.</p>
            <ul className="features-list">
              <li>Personal profile management</li>
              <li>Record smoking status</li>
              <li>Basic smoking cessation planning</li>
              <li>Record basic smoking cessation progress</li>
              <li>Receive motivational notifications</li>
              <li>View basic statistical information</li>
            </ul>
          </div>
          {renderCtaButton('basic')}
          <br className="br-ig"></br>
        
          

          
        </div>

        {/* Advanced Plan Card - MODIFIED */}
        <div className="membership-card advanced-plan promoted-card">
          <span className="ribbon">Most Popular!</span>
          <h2>Advanced</h2>
          <p className="price">*** VND / month</p>
          <div className="card-content-wrapper">
            <p className="description">Upgrade to receive comprehensive support and achieve the best results!</p>
            <ul className="features-list">
              <li className="highlight-feature">Advanced smoking cessation planning</li>
              <li className="highlight-feature">Record detailed smoking cessation progress</li>
              <li className="highlight-feature">Full statistics</li>
              <li className="highlight-feature">Receive full achievement badges</li>
              <li className="highlight-feature">Share badges on social media</li>
              <li className="highlight-feature">Live chat with a coach</li>
              <li className="highlight-feature">Assessment and feedback</li>
            </ul>
          </div>
          {/* NEW WRAPPER FOR BUTTON AND CANCELLATION INFO */}
          <div className="card-bottom-cta">
                {renderCtaButton('advanced')} {/* Call the passed function */}            
                <p className="cancellation-info">Cancel anytime.</p>
          </div>
          {/* END NEW WRAPPER */}
        </div>
      </div>
      </>
    )
}

export default memberCard