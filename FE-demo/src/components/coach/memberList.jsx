// --- START OF IMPROVED FILE ---
import React from 'react';
import { Card, Avatar, Tag, Button, List, Tooltip } from 'antd';
import { WarningFilled } from '@ant-design/icons'; // Icon cảnh báo

function MemberListPage() {
    // Dữ liệu mẫu - thêm thuộc tính `needsAttention`
    const members = [
        { id: 1, name: 'Alice Johnson', smokeFreeDays: 92, status: 'On Track', lastCheckIn: 'Today', needsAttention: false },
        { id: 2, name: 'Bob Williams', smokeFreeDays: 15, status: 'Struggling', lastCheckIn: 'Yesterday', needsAttention: true },
        { id: 3, name: 'Charlie Brown', smokeFreeDays: 210, status: 'Successful', lastCheckIn: '1 week ago', needsAttention: false },
        { id: 4, name: 'Diana Prince', smokeFreeDays: 5, status: 'Relapsed', lastCheckIn: '2 hours ago', needsAttention: true },
    ];

    const getStatusColor = (status) => {
        if (status === 'On Track') return 'success';
        if (status === 'Struggling') return 'warning';
        if (status === 'Relapsed') return 'error';
        return 'default';
    }

    return (
        <div className="main-content">
            <header className="main-header">
                <h1>My Assigned Members</h1>
                <p>Monitor their progress and offer support.</p>
            </header>
            <List
                grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4 }}
                dataSource={members}
                renderItem={(member) => (
                    <List.Item>
                        <Card 
                            // Thêm icon cảnh báo vào tiêu đề nếu cần chú ý
                            title={
                                <span>
                                    {member.name}
                                    {member.needsAttention && (
                                        <Tooltip title="This member needs attention!">
                                            <WarningFilled style={{ color: '#faad14', marginLeft: '8px' }} />
                                        </Tooltip>
                                    )}
                                </span>
                            }
                            // Thêm viền màu vàng cho card cần chú ý
                            style={member.needsAttention ? { border: '2px solid #faad14' } : {}}
                            extra={<Avatar src={`https://api.dicebear.com/7.x/initials/svg?seed=${member.name}`} />}
                            actions={[
                                <Button type="primary">Chat</Button>,
                                <Button>View Details</Button>,
                            ]}
                        >
                            <p><strong>Smoke-free for:</strong> {member.smokeFreeDays} days</p>
                            <p><strong>Status:</strong> <Tag color={getStatusColor(member.status)}>{member.status}</Tag></p>
                            <p><strong>Last Check-in:</strong> {member.lastCheckIn}</p>
                        </Card>
                    </List.Item>
                )}
            />
        </div>
    );
}

export default MemberListPage;