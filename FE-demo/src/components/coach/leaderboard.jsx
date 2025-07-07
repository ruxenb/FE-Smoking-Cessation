// --- START OF NEW FILE ---
import React from 'react';
import { Table } from 'antd'; // Dùng Table của Ant Design cho đẹp

function LeaderboardPage() {
    // Dữ liệu mẫu, sẽ được lấy từ API
    const dataSource = [
        { key: '1', rank: 1, name: 'Coach John Doe', score: '92%', feedback: '4.9/5' },
        { key: '2', rank: 2, name: 'Coach Jane Smith', score: '88%', feedback: '4.8/5' },
        { key: '3', rank: 3, name: 'You', score: '85%', feedback: '4.7/5' },
        { key: '4', rank: 4, name: 'Coach Alex Ray', score: '81%', feedback: '4.6/5' },
    ];

    const columns = [
        { title: 'Rank', dataIndex: 'rank', key: 'rank', render: (text) => <strong>{text}</strong> },
        { title: 'Coach Name', dataIndex: 'name', key: 'name' },
        { title: 'Member Success Rate', dataIndex: 'score', key: 'score', sorter: (a, b) => parseFloat(a.score) - parseFloat(b.score) },
        { title: 'User Feedback', dataIndex: 'feedback', key: 'feedback', sorter: (a, b) => parseFloat(a.feedback) - parseFloat(b.feedback) },
    ];

    return (
        <div className="main-content">
            <header className="main-header">
                <h1>Coach Leaderboard</h1>
                <p>See how you stack up against other coaches based on member success.</p>
            </header>
            <Table dataSource={dataSource} columns={columns} pagination={false} />
        </div>
    );
}

export default LeaderboardPage;