import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message, Input, Tag, App } from 'antd';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { adminGetAllPosts, adminDeletePost, adminRestorePost  } from '../../services/adminService';
import 'antd/dist/reset.css'

const { Search } = Input;

function AdminBlogManagement() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');

    const [modal, contextHolder] = Modal.useModal();



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
        modal.confirm({
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
                    fetchPosts(); // Tải lại danh sách để cập nhật giao diện
                } catch (error) {
                    message.error('Failed to delete post.');
                }

            },
        });
    };

    const handleRestore = async (postId) => {
        try {
            const token = `Bearer ${localStorage.getItem("accessToken")}`;
            await adminRestorePost(postId, token);
            message.success('Post restored successfully!');
            fetchPosts(); // Tải lại danh sách để cập nhật trạng thái
        } catch (error) {
            message.error('Failed to restore post.');
            console.error(error);
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'postId', key: 'id', sorter: (a, b) => a.postId - b.postId, width: 80 },
        { 
            title: 'Title', 
            dataIndex: 'title', 
            key: 'title', 
            sorter: (a, b) => a.title.localeCompare(b.title) 
        },
        { title: 'Author (User ID)', dataIndex: 'userId', key: 'author', sorter: (a, b) => a.userId - b.userId, width: 150 },
        { 
            title: 'Created At', 
            dataIndex: 'createdAt', 
            key: 'date',
            render: (text) => format(new Date(text), 'dd/MM/yyyy HH:mm'),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            width: 180
        },
        {
            title: 'Status',
            dataIndex: 'published', // Dùng thuộc tính 'published' từ DTO
            key: 'status',
            width: 120,
            // Dùng `render` để tùy biến cách hiển thị
            render: (isPublished) => {
                const color = isPublished ? 'green' : 'volcano'; // Chọn màu cho Tag
                const text = isPublished ? 'Published' : 'Hidden'; // Chọn chữ cho Tag
                return <Tag color={color}>{text.toUpperCase()}</Tag>;
            },
            // Thêm bộ lọc để Admin có thể xem riêng bài Published/Hidden
            filters: [
                { text: 'Published', value: true },
                { text: 'Hidden', value: false },
            ],
            onFilter: (value, record) => record.published === value,
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 200,
            render: (_, record) => (
                <Space size="middle">
                    <Link to={`/blog/${record.postId}`} target="_blank" rel="noopener noreferrer">
                        View Details
                    </Link>
                    
                    {/* Hiển thị nút dựa trên trạng thái 'published' của bài đăng */}
                    {record.published ? (
                        // Nếu bài đăng đang được published, hiển thị nút Delete
                        <Button type="link" danger onClick={() => handleDelete(record.postId)}>
                            Delete (Hide)
                        </Button>
                    ) : (
                        // Nếu bài đăng đang bị ẩn, hiển thị nút Restore
                        <Button type="link" onClick={() => handleRestore(record.postId)}>
                            Restore
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <h2 style={{margin: 0}}>All Community Posts</h2>
                 <Search
                    placeholder="Search by post title..."
                    onSearch={value => setSearchText(value)}
                    onChange={e => setSearchText(e.target.value)}
                    style={{ width: 300 }}
                    allowClear
                />
            </div>
            <Table
                columns={columns}
                dataSource={filteredPosts}
                loading={loading}
                rowKey="postId"
                pagination={{ pageSize: 10, showSizeChanger: true }}
                bordered
                scroll={{ x: 'max-content' }}
            />
            {contextHolder}
        </div>
    );
}

export default AdminBlogManagement;