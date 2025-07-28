import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message, Input, Tag, Form, InputNumber, Switch, App } from 'antd';
import { adminGetAllPackages, adminCreatePackage, adminUpdatePackage, adminDeactivatePackage } from '../../services/adminService';

function AdminMembershipManagement() {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingPackage, setEditingPackage] = useState(null);
    const [form] = Form.useForm();
    const { modal } = App.useApp();

    const fetchPackages = async () => {
        try {
            setLoading(true);
            const token = `Bearer ${localStorage.getItem("accessToken")}`;
            const res = await adminGetAllPackages(token);
            setPackages(res.data.data || []);
        } catch (error) {
            message.error("Failed to load membership packages.", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    const showCreateModal = () => {
        setEditingPackage(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const showEditModal = (pkg) => {
        setEditingPackage(pkg);
        form.setFieldsValue(pkg);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingPackage(null);
    };

    const handleFormSubmit = async (values) => {
        const token = `Bearer ${localStorage.getItem("accessToken")}`;
        try {
            if (editingPackage) {
                // Update
                await adminUpdatePackage(editingPackage.id, values, token);
                message.success('Package updated successfully!');
            } else {
                // Create
                await adminCreatePackage(values, token);
                message.success('Package created successfully!');
            }
            setIsModalVisible(false);
            fetchPackages();
        } catch (error) {
            console.error("Failed to save package:", error);

            // Lấy thông điệp lỗi cụ thể từ response của backend
            const errorMessage = error.response?.data?.message || // Lỗi từ ResponseDto
                                 error.response?.data ||          // Lỗi từ IllegalStateException
                                 'An error occurred. Please try again.';

            // Hiển thị thông báo lỗi đó cho Admin
            message.error(errorMessage);        }
    };

    const handleDeactivate = (packageId) => {
        modal.confirm({
            title: 'Are you sure you want to deactivate this package?',
            content: 'Users will no longer be able to purchase this package.',
            okText: 'Deactivate',
            okType: 'danger',
            onOk: async () => {
                try {
                    const token = `Bearer ${localStorage.getItem("accessToken")}`;
                    await adminDeactivatePackage(packageId, token);
                    message.success('Package deactivated successfully!');
                    fetchPackages();
                } catch (error) {
                    message.error('Failed to deactivate package.', error.message);
                }
            }
        });
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Package Name', dataIndex: 'packageName', key: 'name' },
        { 
            title: 'Price', 
            dataIndex: 'price', 
            key: 'price',
            render: (price) => `${price.toLocaleString('vi-VN')} VND`
        },
        { title: 'Duration (Days)', dataIndex: 'durationInDays', key: 'duration' },
        {
            title: 'Status',
            dataIndex: 'active',
            key: 'status',
            render: (isActive) => <Tag color={isActive ? 'green' : 'red'}>{isActive ? 'Active' : 'Inactive'}</Tag>
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => showEditModal(record)}>Edit</Button>
                    {record.active && <Button danger onClick={() => handleDeactivate(record.id)}>Deactivate</Button>}
                </Space>
            )
        }
    ];

    return (
        <div style={{ background: '#fff', padding: 24, borderRadius: '8px' }}>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <h2 style={{ margin: 0 }}>Membership Package Management</h2>
                <Button type="primary" onClick={showCreateModal}>Create New Package</Button>
            </div>
            <Table
                columns={columns}
                dataSource={packages}
                loading={loading}
                rowKey="id"
                bordered
            />
            <Modal
                title={editingPackage ? 'Edit Package' : 'Create New Package'}
                open={isModalVisible}
                onOk={form.submit}
                onCancel={handleCancel}
                okText="Save"
            >
                <Form form={form} layout="vertical" name="packageForm" onFinish={handleFormSubmit}>
                    <Form.Item name="packageName" label="Package Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item name="price" label="Price (VND)" rules={[{ required: true, type: 'number' }]}>
                        <InputNumber style={{ width: '100%' }} min={0} step={1000} />
                    </Form.Item>
                    <Form.Item name="durationInDays" label="Duration (in days)" rules={[{ required: true, type: 'integer' }]}>
                        <InputNumber style={{ width: '100%' }} min={1} />
                    </Form.Item>
                     <Form.Item name="active" label="Active" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

// Bọc component để có context cho Modal và Message
const AdminMembershipManagementPage = () => (
    <App>
        <AdminMembershipManagement />
    </App>
);

export default AdminMembershipManagementPage;