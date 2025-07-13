import React from 'react';
import { Menu } from 'antd';
import { DashboardOutlined, UserOutlined, ReadOutlined /* ... các icon khác */ } from '@ant-design/icons';
import { useUser } from '../../userContext/userContext';
import { useNavigate } from 'react-router-dom';

// Nhận props isCollapsed, onToggle, currentPage, setCurrentPage
function AdminSidebar({ isCollapsed, onToggle, currentPage, setCurrentPage }) {
    const { logout } = useUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm("Do you want to log out?")) {
            logout();
            navigate('/login');
        }
    };

    return (
        <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
            <div className="logo" onClick={onToggle}>
               {/* ... logo ... */}
               <span>Admin Panel</span>
            </div>
            <nav className="navigation">
                <a href="#" className={currentPage === 'dashboard' ? 'active' : ''} onClick={() => setCurrentPage('dashboard')}>
                    <DashboardOutlined /> <span>Dashboard</span>
                </a>
                <a href="#" className={currentPage === 'users' ? 'active' : ''} onClick={() => setCurrentPage('users')}>
                    <UserOutlined /> <span>User Management</span>
                </a>
                 <a href="#" className={currentPage === 'blog' ? 'active' : ''} onClick={() => setCurrentPage('blog')}>
                    <ReadOutlined /> <span>Blog Management</span>
                </a>
                {/* Thêm các mục khác tương tự */}
            </nav>
             <div className="sidebar-footer">
                <a href="#" className="logout-button" onClick={handleLogout}>
                    {/* ... logout button ... */}
                </a>
            </div>
        </aside>
    );
}
export default AdminSidebar;



            // <Menu theme="dark" mode="inline" defaultSelectedKeys={['/admin']} onClick={handleMenuClick}>
            //     <Menu.Item key="/admin" icon={<DashboardOutlined />}>
            //         Dashboard
            //     </Menu.Item>
            //     <Menu.Item key="/admin/users" icon={<UserOutlined />}>
            //         User Management
            //     </Menu.Item>
            //     <Menu.Item key="/admin/memberships" icon={<ShoppingOutlined />}>
            //         Membership Packages
            //     </Menu.Item>
            //     <Menu.Item key="/admin/blog" icon={<ReadOutlined />}>
            //         Blog & Community
            //     </Menu.Item>
            //     <Menu.Item key="/admin/feedback" icon={<MessageOutlined />}>
            //         Feedback
            //     </Menu.Item>
            //     <Menu.Item key="/admin/reports" icon={<BarChartOutlined />}>
            //         Reports
            //     </Menu.Item>
            // </Menu>
