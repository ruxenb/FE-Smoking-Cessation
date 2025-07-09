// --- START OF REVISED FILE ---
import React from 'react';
import StatCard from '../dashboard/StatCard'; // Tái sử dụng component StatCard

function CoachOverview({ coachName }) {
    // Dữ liệu này sẽ được lấy từ API, phản ánh công việc của Coach
    const coachStats = {
        assignedMembers: 15,
        attentionNeeded: 3, // Số thành viên báo cáo tái nghiện hoặc cần hỗ trợ khẩn
        unreadMessages: 8,
        avgFeedback: "4.8 / 5.0" // Điểm đánh giá trung bình từ người dùng
    };

    return (
        <main className="main-content">
            <header className="main-header">
                <div className="welcome-message">
                    <h1>Coach Dashboard</h1>
                    <p>Welcome back, <span className="username">{coachName}</span>! Here’s your activity summary.</p>
                </div>

                <div className="user-profile">
                    <img
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${coachName}`}
                        alt="User Avatar"
                    />
                </div>
            </header>
            

            {/* Các StatCard giờ hiển thị chỉ số của Coach */}
            <section className="stats-grid">
                <StatCard 
                    icon="👥" 
                    iconClass="card-icon--health" 
                    value={coachStats.assignedMembers} 
                    label="Total Members" 
                />
                <StatCard 
                    icon="⚠️" 
                    iconClass="card-icon--avoided" 
                    value={coachStats.attentionNeeded} 
                    label="Members Needing Attention" 
                />
                <StatCard 
                    icon="📧" 
                    iconClass="card-icon--streak" 
                    value={coachStats.unreadMessages} 
                    label="Unread Messages" 
                />
                <StatCard 
                    icon="⭐" 
                    iconClass="card-icon--money" 
                    value={coachStats.avgFeedback} 
                    label="Average User Feedback" 
                />
            </section>

            {/* Phần này có thể là danh sách các member cần chú ý nhất */}
            <section className="achievements-section">
                <div className="section-header">
                  <h2>Priority List</h2>
                  <a href="#" className="view-all">View All Members</a>
                </div>
                {/* Dưới đây có thể là một list các card member cần chú ý */}
                <p>A list of members who have recently relapsed or sent urgent messages would appear here.</p>
            </section>
        </main>
    );
}

export default CoachOverview;