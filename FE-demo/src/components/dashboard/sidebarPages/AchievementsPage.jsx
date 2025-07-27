import React, { useEffect, useState } from 'react';
import { 
  fetchAchievements, 
  fetchUserAchievementProgress,
  checkUserAchievements 
} from '../../../services/achievementService';
import AchievementCard from '../../dashboard/AchievementCard';
import toast, { Toaster } from 'react-hot-toast';
import { useUser } from '../../../userContext/userContext';
import '../../dashboard/dashboard.css';

function AchievementsPage() {
  const [achievements, setAchievements] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingProgress, setCheckingProgress] = useState(false);
  const [newlyUnlocked, setNewlyUnlocked] = useState([]);
  
  // Filter states
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'unlocked', 'locked'
  
  const { user } = useUser();
  const tokenType = localStorage.getItem("tokenType");
  const accessToken = localStorage.getItem("accessToken");
  const fullToken = tokenType && accessToken ? `${tokenType} ${accessToken}` : null;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        const [achievementsRes, progressRes] = await Promise.all([
          fetchAchievements(fullToken),
          user ? fetchUserAchievementProgress(user.userId, fullToken) : Promise.resolve({ data: { data: [] } })
        ]);
        
        setAchievements(achievementsRes.data.data);
        setUserProgress(progressRes.data.data);
      } catch (err) {
        toast.error("Failed to load achievements");
        console.error("Failed to load achievements:", err);
      } finally {
        setLoading(false);
      }
    };

    if (fullToken) {
      loadData();
    }
  }, [user, fullToken]);

  const handleCheckProgress = async () => {
    if (!user) {
      toast.error("Please login to check progress");
      return;
    }

    try {
      setCheckingProgress(true);
      const res = await checkUserAchievements(user.userId, fullToken);
      const newAchievements = res.data.data;
      
      if (newAchievements.length > 0) {
        toast.success(`🎉 You unlocked ${newAchievements.length} new achievement(s): ${newAchievements.join(', ')}!`);
        
        const progressRes = await fetchUserAchievementProgress(user.userId, fullToken);
        const newProgressData = progressRes.data.data;
        
        const newlyUnlockedIds = newProgressData
          .filter(progress => {
            const isMatch = progress.earned && newAchievements.includes(progress.achievementName);
            return isMatch;
          })
          .map(progress => progress.achievementId);
        
        setNewlyUnlocked(newlyUnlockedIds);
        setUserProgress(newProgressData);
        
        setTimeout(() => {
          setNewlyUnlocked([]);
        }, 3000);
        
      } else {
        toast("No new achievements unlocked", { 
          icon: 'ℹ️',
          style: {
            borderLeft: '4px solid #3b82f6',
            background: '#eff6ff'
          }
        });
      }
    } catch (err) {
      toast.error("Failed to check achievements");
      console.error("Failed to check achievements:", err);
    } finally {
      setCheckingProgress(false);
    }
  };

  const filterByCategory = (category) => {
    return achievements.filter(a => a.category === category);
  };

  const getUserProgress = (achievementId) => {
    return userProgress.find(p => p.achievementId === achievementId);
  };

  const isNewlyUnlocked = (achievementId) => {
    return newlyUnlocked.includes(achievementId);
  };

  // Filter achievements based on active filter
  const filterAchievements = (categoryAchievements) => {
    if (activeFilter === 'all') return categoryAchievements;
    
    return categoryAchievements.filter(ach => {
      const progress = getUserProgress(ach.achievementId);
      const isEarned = progress?.earned || false;
      
      if (activeFilter === 'unlocked') return isEarned;
      if (activeFilter === 'locked') return !isEarned;
      
      return true;
    });
  };

  // Get counts for filter badges
  const getFilterCounts = () => {
    const allAchievements = achievements;
    const unlockedCount = allAchievements.filter(ach => {
      const progress = getUserProgress(ach.achievementId);
      return progress?.earned || false;
    }).length;
    const lockedCount = allAchievements.length - unlockedCount;
    
    return {
      all: allAchievements.length,
      unlocked: unlockedCount,
      locked: lockedCount
    };
  };

  const counts = getFilterCounts();

  if (loading) {
    return (
      <div className="main-content">
        <div className="loading">Loading achievements...</div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="main-content">
        <header className="main-header">
          <div className="welcome-message">
            <h1>Your Achievements</h1>
            <p>Track your incredible progress and unlock new milestones.</p>
          </div>
          <div className="header-actions">
            <button 
              className="check-progress-btn"
              onClick={handleCheckProgress}
              disabled={checkingProgress || !user}
            >
              {checkingProgress ? "Checking..." : "🔍 Check Progress"}
            </button>
          </div>
        </header>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All
            <span className="filter-count">{counts.all}</span>
          </button>
          <button 
            className={`filter-tab ${activeFilter === 'unlocked' ? 'active' : ''}`}
            onClick={() => setActiveFilter('unlocked')}
          >
            Unlocked
            <span className="filter-count unlocked">{counts.unlocked}</span>
          </button>
          <button 
            className={`filter-tab ${activeFilter === 'locked' ? 'active' : ''}`}
            onClick={() => setActiveFilter('locked')}
          >
            Locked
            <span className="filter-count locked">{counts.locked}</span>
          </button>
        </div>

        {/* Time-Based Achievements */}
        {filterAchievements(filterByCategory("time")).length > 0 && (
          <section className="achievements-section">
            <div className="section-header">
              <h2>Time-Based Milestones</h2>
            </div>
            <div className="achievements-grid">
              {filterAchievements(filterByCategory("time")).map((ach) => {
                const progress = getUserProgress(ach.achievementId);
                return (
                  <AchievementCard 
                    key={ach.achievementId} 
                    achievementId={ach.achievementId}
                    name={ach.name}
                    icon={ach.icon}
                    description={ach.description}
                    category={ach.category}
                    userProgress={progress}
                    isNewlyUnlocked={isNewlyUnlocked(ach.achievementId)}
                  />
                );
              })}
            </div>
          </section>
        )}

        {/* Financial Achievements */}
        {filterAchievements(filterByCategory("financial")).length > 0 && (
          <section className="achievements-section">
            <div className="section-header">
              <h2>Financial Goals</h2>
            </div>
            <div className="achievements-grid">
              {filterAchievements(filterByCategory("financial")).map((ach) => {
                const progress = getUserProgress(ach.achievementId);
                return (
                  <AchievementCard 
                    key={ach.achievementId} 
                    achievementId={ach.achievementId}
                    name={ach.name}
                    icon={ach.icon}
                    description={ach.description}
                    category={ach.category}
                    userProgress={progress}
                    isNewlyUnlocked={isNewlyUnlocked(ach.achievementId)}
                  />
                );
              })}
            </div>
          </section>
        )}

        {/* Health Achievements */}
        {filterAchievements(filterByCategory("health")).length > 0 && (
          <section className="achievements-section">
            <div className="section-header">
              <h2>Health & Wellness</h2>
            </div>
            <div className="achievements-grid">
              {filterAchievements(filterByCategory("health")).map((ach) => {
                const progress = getUserProgress(ach.achievementId);
                return (
                  <AchievementCard 
                    key={ach.achievementId} 
                    achievementId={ach.achievementId}
                    name={ach.name}
                    icon={ach.icon}
                    description={ach.description}
                    category={ach.category}
                    userProgress={progress}
                    isNewlyUnlocked={isNewlyUnlocked(ach.achievementId)}
                  />
                );
              })}
            </div>
          </section>
        )}

        {/* Empty State */}
        {activeFilter !== 'all' && 
         filterAchievements(achievements).length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              {activeFilter === 'unlocked' ? '🔓' : '🔒'}
            </div>
            <h3>No {activeFilter} achievements</h3>
            <p>
              {activeFilter === 'unlocked' 
                ? "Keep going! Check your progress to unlock achievements."
                : "Great job! You've unlocked all available achievements."
              }
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default AchievementsPage;
