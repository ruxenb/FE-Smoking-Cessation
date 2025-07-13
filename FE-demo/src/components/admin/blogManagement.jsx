import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message, Input } from 'antd';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { adminGetAllPosts, adminDeletePost } from '../../services/adminService';

const { confirm } = Modal;
const { Search } = Input;

function AdminBlogManagement() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const token = `Bearer ${localStorage.getItem("accessToken")}`;
            const res = await adminGetAllPosts(token);
            setPosts(res.data.data || []);
        } catch (error) {
            message.error("Failed to load posts.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = (postId) => {
        confirm({
            title: 'Are you sure you want to delete this post?',
            content: 'This action will permanently delete the post and all its comments. This cannot be undone.',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'No, Cancel',
            onOk: async () => {
                try {
                    const token = `Bearer ${localStorage.getItem("accessToken")}`;
                    await adminDeletePost(postId, token);
                    message.success('Post deleted successfully!');
                    fetchPosts(); // Tải lại danh sách sau khi xóa
                } catch (error) {
                    message.error('Failed to delete post.');
                }
            },
        });
    };

    const columns = [
        { title: 'ID', dataIndex: 'postId', key: 'id', sorter: (a, b) => a.postId - b.postId, width: '80px' },
        { 
            title: 'Title', 
            dataIndex: 'title', 
            key: 'title', 
            sorter: (a, b) => a.title.localeCompare(b.title) 
        },
        { title: 'Author (User ID)', dataIndex: 'userId', key: 'author', sorter: (a, b) => a.userId - b.userId, width: '150px' },
        { 
            title: 'Created At', 
            dataIndex: 'createdAt', 
            key: 'date',
            render: (text) => format(new Date(text), 'dd/MM/yyyy HH:mm'),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            width: '180px'
        },
        {
            title: 'Actions',
            key: 'actions',
            width: '200px',
            render: (_, record) => (
                <Space size="middle">
                    <Link to={`/blog/${record.postId}`} target="_blank" rel="noopener noreferrer">View Details</Link>
                    <Button type="link" danger onClick={() => handleDelete(record.postId)}>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div style={{ padding: '24px', background: '#fff', minHeight: '100vh' }}>
            <h1 style={{ marginBottom: '24px' }}>Blog & Community Management</h1>
            <Search
                placeholder="Search by post title..."
                onChange={e => setSearchText(e.target.value)}
                style={{ marginBottom: '20px', width: '300px' }}
            />
            <Table
                columns={columns}
                dataSource={filteredPosts}
                loading={loading}
                rowKey="postId"
                pagination={{ pageSize: 10 }}
                bordered
            />
        </div>
    );
}

export default AdminBlogManagement;