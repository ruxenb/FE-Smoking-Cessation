import React, { useState } from 'react';
import { Layout } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import AdminSidebar from './layout/adminSidebar';
import { Outlet } from 'react-router-dom';

const { Header, Content } = Layout;

function AdminLayout() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <AdminSidebar collapsed={collapsed} />
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{ padding: 0, background: '#fff' }}>
                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: () => setCollapsed(!collapsed),
                        style: { fontSize: '18px', padding: '0 24px', cursor: 'pointer' }
                    })}
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: '#f0f2f5', // Màu nền cho nội dung
                    }}
                >
                    {/* Các trang con sẽ được render ở đây */}
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}

export default AdminLayout;