import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  message,
  Input,
  Tag,
  Form,
  App,
} from "antd";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import {
  adminGetAllPosts,
  adminDeletePost,
  adminRestorePost,
} from "../../services/adminService";
import api from "../../configs/api/axios"; // <-- Make sure you have this import for API calls
import "antd/dist/reset.css";
import { useUser } from "../../userContext/userContext"; // or your actual user context path

const { Search } = Input;

function AdminBlogManagement() {
  const { user } = useUser(); // user.userId should be the admin's id

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [modal, contextHolder] = Modal.useModal();

  // Create Post Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [form] = Form.useForm();

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
      title: "Are you sure you want to delete this post?",
      content:
        "This action will permanently delete the post and all its comments. This cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No, Cancel",
      onOk: async () => {
        try {
          const token = `Bearer ${localStorage.getItem("accessToken")}`;
          await adminDeletePost(postId, token);
          message.success("Post deleted successfully!");
          fetchPosts();
        } catch (error) {
          message.error("Failed to delete post.");
          console.error(error);
        }
      },
    });
  };

  const handleRestore = async (postId) => {
    try {
      const token = `Bearer ${localStorage.getItem("accessToken")}`;
      await adminRestorePost(postId, token);
      message.success("Post restored successfully!");
      fetchPosts();
    } catch (error) {
      message.error("Failed to restore post.");
      console.error(error);
    }
  };

  // CREATE POST HANDLERS
  const openCreateModal = () => {
    form.resetFields();
    setIsCreateModalOpen(true);
  };

  const handleCreatePost = async () => {
    try {
      const values = await form.validateFields();
      setCreateLoading(true);
      const token = `Bearer ${localStorage.getItem("accessToken")}`;
      await api.post(
        "/posts",
        {
          ...values,
          userId: user.userId, // use the actual admin's userId
        },
        {
          headers: { Authorization: token },
        }
      );
      message.success("Post created successfully!");
      setIsCreateModalOpen(false);
      fetchPosts();
    } catch (err) {
      if (err.errorFields) return; // Form validation error
      message.error("Failed to create post.");
      console.error(err);
    } finally {
      setCreateLoading(false);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "postId",
      key: "id",
      sorter: (a, b) => a.postId - b.postId,
      width: 80,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Author",
      dataIndex: "authorName",
      key: "author",
      render: (text) => text || <span style={{ color: "#aaa" }}>Unknown</span>,
      sorter: (a, b) => {
        const nameA = a.authorName || "";
        const nameB = b.authorName || "";
        return nameA.localeCompare(nameB);
      },
      width: 180,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "date",
      render: (text) => format(new Date(text), "dd/MM/yyyy HH:mm"),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      width: 180,
    },
    {
      title: "Status",
      dataIndex: "published",
      key: "status",
      width: 120,
      render: (isPublished) => {
        const color = isPublished ? "green" : "volcano";
        const text = isPublished ? "Published" : "Hidden";
        return <Tag color={color}>{text.toUpperCase()}</Tag>;
      },
      filters: [
        { text: "Published", value: true },
        { text: "Hidden", value: false },
      ],
      onFilter: (value, record) => record.published === value,
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Link
            to={`/blog/${record.postId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Details
          </Link>
          {record.published ? (
            <Button
              type="link"
              danger
              onClick={() => handleDelete(record.postId)}
            >
              Delete (Hide)
            </Button>
          ) : (
            <Button type="link" onClick={() => handleRestore(record.postId)}>
              Restore
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0 }}>All Community Posts</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <Button type="primary" onClick={openCreateModal}>
            + Create Post
          </Button>
          <Search
            placeholder="Search by post title..."
            onSearch={(value) => setSearchText(value)}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={filteredPosts}
        loading={loading}
        rowKey="postId"
        pagination={{ pageSize: 10, showSizeChanger: true }}
        bordered
        scroll={{ x: "max-content" }}
      />
      {contextHolder}

      <Modal
        title="Create New Post"
        open={isCreateModalOpen}
        onOk={handleCreatePost}
        onCancel={() => setIsCreateModalOpen(false)}
        confirmLoading={createLoading}
        okText="Create"
        destroyOnClose
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter the post title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Content"
            name="content"
            rules={[
              { required: true, message: "Please enter the post content" },
            ]}
          >
            <Input.TextArea rows={6} />
          </Form.Item>
          {/* Optional: Add category or other fields here */}
        </Form>
      </Modal>
    </div>
  );
}

const AdminBlogManagementPage = () => (
  <App>
    <AdminBlogManagement />
  </App>
);

// Export component đã được bọc
export default AdminBlogManagementPage;
