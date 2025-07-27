import React, { useState, useEffect } from 'react';
import './achievements.css';


function AchievementCard({ 
  achievementId,
  name,
  icon,
  description,
  category,
  userProgress,
  isNewlyUnlocked = false // New prop for animation trigger
}) {
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  // Fix: Use 'earned' instead of 'isEarned'
  const isEarned = userProgress?.earned || false;
  const currentProgress = userProgress?.currentProgress || 0;
  const targetProgress = userProgress?.targetProgress || 0;
  const progressPercentage = userProgress?.progressPercentage || 0;
  const progressText = userProgress?.progressText || "";

  const cardClass = `achievement-card ${isEarned ? 'unlocked' : 'locked'} ${category} ${showUnlockAnimation ? 'unlocking' : ''}`;
  
  // Trigger unlock animation when newly unlocked
  useEffect(() => {
    if (isNewlyUnlocked && !hasAnimated) {
      setShowUnlockAnimation(true);
      setHasAnimated(true);
      
      // Remove animation class after animation completes
      const timer = setTimeout(() => {
        setShowUnlockAnimation(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isNewlyUnlocked, hasAnimated]);
  
  // Add debugging
  console.log(`Achievement ${name}:`, {
    isEarned,
    userProgress,
    isNewlyUnlocked,
    showUnlockAnimation
  });
  
  return (
    <div className={cardClass}>
      {/* Unlock animation overlay */}
      {showUnlockAnimation && (
        <div className="unlock-animation">
          <div className="unlock-burst">🎉</div>
          <div className="unlock-text">UNLOCKED!</div>
          <div className="unlock-particles">
            <span>✨</span>
            <span>🌟</span>
            <span>⭐</span>
            <span>💫</span>
          </div>
        </div>
      )}
      
      <div className="ach-icon">
        {isEarned ? icon : '🔒'}
      </div>
      <div className="ach-content">
        <h3 className="ach-name">{name}</h3>
        <p className="ach-description">{description}</p>
        
        {!isEarned && userProgress && (
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
            <span className="progress-text">
              {progressText}
            </span>
            <span className="progress-percentage">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
        )}
        
        {isEarned && (
          <div className="achievement-earned">
            <span className="earned-badge">✅ Unlocked!</span>
            {userProgress?.createdAt && (
              <span className="earned-date">
                Earned: {new Date(userProgress.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
        )}
        
        {!userProgress && !isEarned && (
          <div className="achievement-locked">
            <span>🔒 Locked</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default AchievementCard;