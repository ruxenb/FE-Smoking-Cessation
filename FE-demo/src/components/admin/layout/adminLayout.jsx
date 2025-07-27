import React, { useState } from 'react';
import { Layout, ConfigProvider } from 'antd'; 
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import AdminSidebar from './adminSidebar';
import { Outlet, useLocation } from 'react-router-dom';
import { antdTheme } from '../../../theme/antdTheme'; // <-- Import theme của bạn


const { Header, Content } = Layout;

function AdminLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    // Updated function to include achievement management route
    const getPageTitle = (pathname) => {
        const routeTitles = {
            '/admin': 'Dashboard',
            '/admin/blog': 'Blog & Community Management',
            '/admin/users': 'User Management',
            '/admin/achievements': 'Achievement Management', // Add this line
            '/admin/memberships': 'Membership Package Management',
            '/admin/feedback': 'Feedback Management',
            '/admin/reports': 'Reports & Statistics'
        };
        return routeTitles[pathname] || 'Admin Panel';
    };

    return (
        <ConfigProvider theme={antdTheme}>
        <Layout style={{ minHeight: '100vh' }}>
            {/* Sidebar điều hướng */}
            <AdminSidebar collapsed={collapsed} />

            <Layout className="site-layout">
                {/* Header chung, có nút thu gọn sidebar và tiêu đề trang */}
                <Header className="site-layout-background" style={{ 
                    padding: '0 24px', 
                    background: '#fff', 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: () => setCollapsed(!collapsed),
                        style: { fontSize: '18px', cursor: 'pointer' }
                    })}
                    <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{getPageTitle(location.pathname)}</h2>
                </Header>

                {/* Khu vực nội dung chính */}
                <Content
                    style={{
                        margin: '24px 16px',
                        minHeight: 280,
                    }}
                >
                    {/* Các trang con (AdminDashboard, AdminBlogManagement,...) sẽ được render ở đây */}
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
        </ConfigProvider>
    );
}

export default AdminLayout;