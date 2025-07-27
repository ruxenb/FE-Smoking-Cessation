import React, { useState } from 'react';
import { useUser } from '../../userContext/userContext';
import { useNavigate } from 'react-router-dom';

// Import các component con của Admin
import AdminSidebarCom from '../../components/admin/layout/adminSidebar';
import AdminDashboardContent from '../../components/admin/adminDashboardContent';
import AdminBlogManagementContent from '../../components/admin/AdminBlogManagement';
import AdminAchievementManagementContent from '../../components/admin/AdminAchievementManagement';
// Import other admin components as needed

// Import CSS chung (nếu có)
import '../../components/dashboard/dashboard.css'; 

function AdminDashboardPage() {
    const { user } = useUser();
    const navigate = useNavigate();

    // State để quản lý sidebar và trang hiện tại
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [currentPage, setCurrentPage] = useState('dashboard'); // Trang mặc định

    // Nếu không phải admin, đá về trang chủ
    if (user?.role !== 'ADMIN') {
        navigate('/');
        return null;
    }

    const handleToggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    // Hàm để render component nội dung tương ứng
    const renderCurrentPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <AdminDashboardContent />;
            case 'blog':
                return <AdminBlogManagementContent />;
            case 'users':
                return <div>User Management - Coming Soon</div>; // Add your user management component
            case 'achievements':
                return <AdminAchievementManagementContent />;
            case 'showFeedbacks':
                return <div>User Feedbacks - Coming Soon</div>; // Add your feedback component
            default:
                return <AdminDashboardContent />;
        }
    };

    return (
        <div className={`app-container ${isCollapsed ? "sidebar-collapsed" : ""}`}>
            <AdminSidebarCom
                isCollapsed={isCollapsed}
                onToggle={handleToggleSidebar}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />

            <div className="main-content-area">
                {renderCurrentPage()}
            </div>
        </div>
    );
}

export default AdminDashboardPage;