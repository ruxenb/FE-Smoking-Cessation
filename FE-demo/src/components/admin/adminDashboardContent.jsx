import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, message, Spin } from 'antd';
import { UserOutlined, TeamOutlined, DollarCircleOutlined, MessageOutlined, ReadOutlined } from '@ant-design/icons';
import { getAdminDashboardStats } from '../../services/adminService'; 

function AdminDashboard() {
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = `Bearer ${localStorage.getItem("accessToken")}`;
                // Giả định backend có endpoint /api/admin/dashboard-stats
                const res = await getAdminDashboardStats(token); 
                if (res.data.status === 'success') {
                    setStats(res.data.data);
                } else {
                    throw new Error(res.data.message || "Could not fetch stats.");
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

    if (loading) {
        return <Spin size="large" style={{ display: 'block', marginTop: '50px' }} />;
    }

    return (
        <div style={{ padding: '1px' }}> {/* Thêm padding để không bị dính sát */}
            <h1>Dashboard Overview</h1>
            <Row gutter={[24, 24]}> {/* Tăng khoảng cách cho thoáng */}
                <Col xs={24} sm={12} md={8} lg={6}>
                        <Statistic
                            title="Total Members"
                            value={stats.totalUsers || 0}
                            prefix={<UserOutlined />}
                        />
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                        <Statistic
                            title="Total Posts"
                            value={stats.totalPosts || 0}
                            prefix={<ReadOutlined />}
                        />
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                        <Statistic
                            title="Total Coaches"
                            value={stats.totalCoaches || 0}
                            prefix={<TeamOutlined />}
                        />
                </Col>
                 <Col xs={24} sm={12} md={8} lg={6}>
                        <Statistic
                            title="Pending Feedbacks"
                            value={stats.pendingFeedbacks || 0}
                            prefix={<MessageOutlined />}
                             valueStyle={{ color: '#cf1322' }}
                        />
                </Col>
            </Row>
            {/* Trong tương lai, bạn có thể thêm các biểu đồ (Charts) ở đây */}
        </div>
    );
}

export default AdminDashboard;