import React, { useState } from "react"; // Import useState
import "./chat.css"; // Import the separate CSS file
import FeedbackForm from "../feedback/FeedbackForm";
import { Button } from "antd"; // Import Button từ Ant Design
import { MessageOutlined, StarOutlined } from "@ant-design/icons";

export default function CoachSelector({
  coaches = [],
  onSelect,
  selectedCoach,
  onlineUserIds,
  user
}) {
  // State để quản lý modal feedback
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  // State để lưu thông tin coach mà người dùng muốn gửi feedback
  const [selectedCoachForFeedback, setSelectedCoachForFeedback] =
    useState(null);

  // Hàm mở modal feedback
  const handleOpenFeedbackModal = (coach) => {
    setSelectedCoachForFeedback(coach);
    setIsFeedbackModalOpen(true);
  };

  // Hàm đóng modal feedback
  const handleCloseFeedbackModal = () => {
    setIsFeedbackModalOpen(false);
    setSelectedCoachForFeedback(null); // Xóa thông tin coach khi đóng
  };

  return (
    <div className="coach-selector-container">
      <h3 className="coach-selector-header">
        Select your coach to start chatting:
      </h3>
      <div className="coach-list">
        {coaches.length === 0 ? (
          <div className="no-coaches-message">No coaches available</div>
        ) : (
          coaches.map((coach) => (
            <div
              key={coach.userId}
              className="coach-card"
              onClick={() => onSelect(coach)}
            >
              <div className="coach-avatar">👤</div>
              <div className="coach-info">
                <div className="coach-name">
                  {coach.name}
                  {onlineUserIds.includes(coach.userId) && (
                    <span className="online-dot" />
                  )}
                </div>
                <div className="coach-id">ID: {coach.userId}</div>
              </div>

              {/* Thêm nút feedback ở đây */}
              <div className="feedback-button-container">
                <Button
                  type="default" // Hoặc 'primary' tùy theo thiết kế
                  icon={<StarOutlined />}
                  size="small" // Kích thước nhỏ hơn để vừa vặn
                  onClick={(e) => {
                    e.stopPropagation(); // Ngăn chặn sự kiện click lan truyền lên coach card
                    handleOpenFeedbackModal(coach);
                  }}
                  className="feedback-button"
                >
                  Feedback
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Render FeedbackForm Modal */}
      {selectedCoachForFeedback && (
        <FeedbackForm
          userId={user?.userId} // Truyền userId của người dùng hiện tại
          receiverId={selectedCoachForFeedback.userId}
          receiverName={selectedCoachForFeedback.name}
          open={isFeedbackModalOpen}
          onClose={handleCloseFeedbackModal}
        />
      )}
    </div>
  );
}
