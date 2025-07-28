import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'antd';
import { ShareAltOutlined } from '@ant-design/icons';
import { useUser } from '../../userContext/userContext';
import { createPost } from '../../services/postService';
import { toast } from 'react-toastify';

import './achievements.css';

function AchievementCard({
  achievementId,
  name,
  icon,
  description,
  category,
  userProgress,
  isNewlyUnlocked = false
}) {
  const { user } = useUser();
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [shareContent, setShareContent] = useState('');
  const [shareTitle, setShareTitle] = useState('');
  const [isSharing, setIsSharing] = useState(false);

  const isEarned = userProgress?.earned || false;
  const currentProgress = userProgress?.currentProgress || 0;
  const targetProgress = userProgress?.targetProgress || 0;
  const progressPercentage = userProgress?.progressPercentage || 0;
  const progressText = userProgress?.progressText || "";

  const cardClass = `achievement-card ${isEarned ? 'unlocked' : 'locked'} ${category} ${showUnlockAnimation ? 'unlocking' : ''}`;

  useEffect(() => {
    if (isNewlyUnlocked && !hasAnimated) {
      setShowUnlockAnimation(true);
      setHasAnimated(true);

      const timer = setTimeout(() => {
        setShowUnlockAnimation(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isNewlyUnlocked, hasAnimated]);

  // Hàm xử lý khi click nút chia sẻ: Chuẩn bị nội dung và mở modal xác nhận
  const handleShareClick = () => {
    const username = user?.fullName || "Người dùng";
    const generatedTitle = `${username} chia sẻ thành tựu ${name}`; // Sử dụng name từ props
    const generatedContent = `Chúc mừng ${username} đã nhận được thành tựu "${name}". 🎉 Mong sự nỗ lực của bạn sẽ lan tỏa đến mọi người!`;

    setShareTitle(generatedTitle);
    setShareContent(generatedContent);
    setIsShareModalVisible(true); // Mở modal xác nhận
  };

  // Hàm gửi post chia sẻ: Gửi API ngay lập tức
  const handleConfirmShare = async () => {
    if (!user?.userId || !user?.fullName) {
      toast.error("User information not available for sharing. Please log in.", { theme: "dark" });
      return;
    }

    setIsSharing(true);
    const fullToken = localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken");

    const postData = {
      content: shareContent, // Sử dụng content đã tạo sẵn
      title: shareTitle,     // Sử dụng title đã tạo sẵn
      userId: user.userId,
    };

    try {
      const response = await createPost(postData, fullToken);
      if (response.status === 201 || response.status === 200) {
        toast.success("Achievement shared successfully!", { theme: "dark" });
        setIsShareModalVisible(false); // Đóng modal
        // Không cần reset shareContent/shareTitle vì chúng sẽ được tạo lại khi share lần sau
      } else {
        toast.error(response.data?.message || "Failed to share achievement.", { theme: "dark" });
      }
    } catch (error) {
      console.error("Error sharing achievement:", error);
      toast.error(error.response?.data?.message || "An error occurred while sharing.", { theme: "dark" });
    } finally {
      setIsSharing(false);
    }
  };

  const handleCancelShare = () => {
    setIsShareModalVisible(false);
    // Không cần reset shareContent/shareTitle ở đây vì chúng chỉ dùng để hiển thị trong modal xác nhận và gửi đi
  };

  return (
    <div className={cardClass}>
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

      <div className="card-top-content">
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
        </div>
      </div>

      {isEarned && (
        <div className="achievement-earned-bottom">
          <span className="earned-badge">✅ Unlocked!</span>
          <Button 
            type="primary" 
            icon={<ShareAltOutlined />} 
            onClick={handleShareClick}
            className="share-achievement-button"
            size="small"
          >
          </Button>
        </div>
      )}

      {!userProgress && !isEarned && (
        <div className="achievement-locked">
          <span>🔒 Locked</span>
        </div>
      )}

      {/* Modal xác nhận chia sẻ */}
      <Modal
        title="Confirm Share Achievement"
        open={isShareModalVisible}
        onOk={handleConfirmShare}
        onCancel={handleCancelShare}
        confirmLoading={isSharing}
        okText="Confirm & Share"
        cancelText="Cancel"
      >
        <p>Are you sure you want to share your achievement "{name}"?</p>
        
        <p>This action cannot be undone.</p>
      </Modal>
    </div>
  );
}

export default AchievementCard;