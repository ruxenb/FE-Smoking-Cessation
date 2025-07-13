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
            >
                <Menu.Item key="/admin" icon={<DashboardOutlined />}>
                    Dashboard
                </Menu.Item>
                <Menu.Item key="/admin/blog" icon={<ReadOutlined />}>
                    Blog Management
                </Menu.Item>
                <Menu.Item key="/admin/users" icon={<UserOutlined />}>
                    User Management
                </Menu.Item>
                {/* Thêm các mục khác ở đây */}

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