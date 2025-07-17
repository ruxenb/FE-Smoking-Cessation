import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, message, Spin, Table, Tag, Typography, App } from 'antd';
import { UserOutlined, TeamOutlined, DollarCircleOutlined, MessageOutlined, ReadOutlined, TrophyOutlined } from '@ant-design/icons';
import { getAdminDashboardStats } from '../../services/adminService';

const { Title } = Typography;

function AdminDashboard() {
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = `Bearer ${localStorage.getItem("accessToken")}`;
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
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    // Prepare achievement data for table
    const achievementColumns = [
        { 
            title: 'Achievement', 
            dataIndex: 'name', 
            key: 'name', 
            render: text => (
                <span>
                    <TrophyOutlined style={{ marginRight: 8, color: '#faad14' }} />
                    {text}
                </span>
            )
        },
        { 
            title: 'Unlocked By', 
            dataIndex: 'count', 
            key: 'count',
            render: count => <Tag color="blue">{count} users</Tag>
        }
    ];

    const getRoleColor = (role) => {
        switch(role) {
            case 'ADMIN': return 'red';
            case 'COACH': return 'blue';
            case 'PAIDMEMBER': return 'gold';
            case 'MEMBER': return 'green';
            default: return 'default';
        }
    };

    return (
        <div style={{ padding: '24px' }}>
            <Title level={2} style={{ marginBottom: 24 }}>Dashboard Overview</Title>
            
            <Row gutter={[24, 24]}>
                {/* User Statistics */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Card hoverable>
                        <Statistic
                            title="Total Users"
                            value={stats.totalUsers || 0}
                            prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                        />
                        {stats.usersByRole && (
                            <div style={{ marginTop: 12 }}>
                                {Object.entries(stats.usersByRole).map(([role, count]) => (
                                    <Tag key={role} color={getRoleColor(role)} style={{ marginBottom: 4 }}>
                                        {role}: {count}
                                    </Tag>
                                ))}
                            </div>
                        )}
                    </Card>
                </Col>

                {/* Active Users */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Card hoverable>
                        <Statistic
                            title="Active Users (Week)"
                            value={stats.activeUsersWeek || 0}
                            prefix={<UserOutlined style={{ color: '#52c41a' }} />}
                        />
                        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
                            <Statistic
                                title="Active Users (Month)"
                                value={stats.activeUsersMonth || 0}
                                prefix={<UserOutlined style={{ color: '#722ed1' }} />}
                            />
                        </div>
                    </Card>
                </Col>

                {/* Posts Statistics */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Card hoverable>
                        <Statistic
                            title="Total Posts"
                            value={stats.totalPosts || 0}
                            prefix={<ReadOutlined style={{ color: '#13c2c2' }} />}
                        />
                        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
                            <Statistic
                                title="Posts This Week"
                                value={stats.postsThisWeek || 0}
                                prefix={<ReadOutlined style={{ color: '#eb2f96' }} />}
                            />
                        </div>
                    </Card>
                </Col>

                {/* Comments */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Card hoverable>
                        <Statistic
                            title="Total Comments"
                            value={stats.totalComments || 0}
                            prefix={<MessageOutlined style={{ color: '#faad14' }} />}
                        />
                    </Card>
                </Col>

                {/* Memberships */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Card hoverable>
                        <Statistic
                            title="Active Memberships"
                            value={stats.memberships?.active || 0}
                            prefix={<TeamOutlined style={{ color: '#52c41a' }} />}
                        />
                        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
                            <Statistic
                                title="Expired"
                                value={stats.memberships?.expired || 0}
                                prefix={<TeamOutlined style={{ color: '#ff4d4f' }} />}
                            />
                        </div>
                        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
                            <Statistic
                                title="Paid"
                                value={stats.memberships?.paid || 0}
                                prefix={<DollarCircleOutlined style={{ color: '#faad14' }} />}
                            />
                        </div>
                    </Card>
                </Col>

                {/* Revenue */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Card hoverable>
                        <Statistic
                            title="Total Revenue"
                            value={stats.totalRevenue || 0}
                            prefix={<DollarCircleOutlined />}
                            valueStyle={{ color: '#cf1322' }}
                            precision={2}
                            suffix="$"
                        />
                    </Card>
                </Col>
            </Row>

            {/* Achievement Stats */}
            <Card style={{ marginTop: 32 }} title="Achievement Statistics" hoverable>
                <Table
                    columns={achievementColumns}
                    dataSource={stats.achievements?.map((item, index) => ({
                        ...item,
                        key: item.id || item.name || index
                    })) || []}
                    pagination={false}
                    size="small"
                    locale={{ emptyText: 'No achievements data available' }}
                />
            </Card>
        </div>
    );
}

export default AdminDashboard;