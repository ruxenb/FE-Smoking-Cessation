import React from 'react';
import { Layout, Menu } from 'antd';
import {
    DashboardOutlined,
    ReadOutlined,
    UserOutlined,
    LogoutOutlined 
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../../userContext/userContext'; // <-- BƯỚC 2: Import useUser

const { Sider } = Layout;

function AdminSidebar({ collapsed }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useUser(); // <-- BƯỚC 3: Lấy hàm logout từ context

    // BƯỚC 4: Cập nhật hàm xử lý click để nhận biết key 'logout'
    const handleMenuClick = ({ key }) => {
        // Nếu key là 'logout', thực hiện đăng xuất
        if (key === 'logout') {
            if (window.confirm("Are you sure you want to log out?")) {
                logout();
                navigate('/login');
            }
        } else {
            // Nếu không phải, điều hướng như bình thường
            navigate(key);
        }
    };

    const menuItems = [
        { key: '/admin', icon: <DashboardOutlined />, label: 'Dashboard' },
        { key: '/admin/blog', icon: <ReadOutlined />, label: 'Blog Management' },
        { key: '/admin/users', icon: <UserOutlined />, label: 'User Management' },
        // ...add more items as needed
    ];

    return (
        <Sider trigger={null} collapsible collapsed={collapsed}>
            <div className="logo" style={{ height: '64px', color: 'white', textAlign: 'center', lineHeight: '64px', fontSize: '1.2rem' }}>
                {collapsed ? 'ADM' : 'Admin Panel'}
            </div>
            {/* Sử dụng hàm xử lý mới */}
            <Menu 
                mode="inline" 
                selectedKeys={[location.pathname]} 
                onClick={handleMenuClick} // <-- Gán hàm xử lý mới
                items={menuItems}
            >
                {/* BƯỚC 5: Thêm một đường kẻ và mục Logout */}
                <Menu.Divider />
                <Menu.Item key="logout" icon={<LogoutOutlined />} danger>
                    Logout
                </Menu.Item>
            </Menu>
        </Sider>
    );
}

export default AdminSidebar;