import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, message } from 'antd';
import { UserOutlined, TeamOutlined, DollarCircleOutlined, MessageOutlined } from '@ant-design/icons';
import { getAdminDashboardStats } from '../../services/adminService';

function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        newUsersThisWeek: 0,
        totalCoaches: 0,
        revenueThisMonth: 0,
        pendingFeedbacks: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = `Bearer ${localStorage.getItem("accessToken")}`;
                const res = await getAdminDashboardStats(token);
                if (res.data.status === 'success') {
                    setStats(res.data.data);
                }
            } catch (error) {
                message.error("Failed to load dashboard statistics.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div style={{ padding: '24px' }}>
            <h1>Admin Dashboard</h1>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Members"
                            value={stats.totalUsers}
                            loading={loading}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Card>
                        <Statistic
                            title="New Members (Week)"
                            value={stats.newUsersThisWeek}
                            loading={loading}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Coaches"
                            value={stats.totalCoaches}
                            loading={loading}
                            prefix={<TeamOutlined />}
                        />
                    </Card>
                </Col>
                 <Col xs={24} sm={12} md={8} lg={6}>
                    <Card>
                        <Statistic
                            title="Pending Feedbacks"
                            value={stats.pendingFeedbacks}
                            loading={loading}
                            prefix={<MessageOutlined />}
                             valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
                {/* Thêm các thẻ thống kê khác nếu cần, ví dụ doanh thu */}
            </Row>
            {/* Bạn có thể thêm các biểu đồ ở đây trong tương lai */}
        </div>
    );
}

export default AdminDashboard;