import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message, Input, Tag, Select, App } from 'antd';
// import { format } from 'date-fns';
import { adminGetAllUsers, adminChangeUserStatus, adminChangeUserRole } from '../../services/adminService';
import { useUser } from '../../userContext/userContext'; // Import useUser để lấy thông tin admin hiện tại
import 'antd/dist/reset.css'


const { Search } = Input;
const { Option } = Select;

function AdminUserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const { user: adminUser } = useUser(); // Lấy thông tin admin đang đăng nhập
    const [modal, contextHolder] = Modal.useModal(); // Dùng hook để sửa lỗi warning


    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = `Bearer ${localStorage.getItem("accessToken")}`;
            const response = await adminGetAllUsers(token);
            setUsers(response.data.data || []); 
        } catch (error) {
            message.error("Failed to load users.");
            console.error('Failed to load users.', error);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleChangeStatus = async (userId, currentStatus) => {
        const action = currentStatus ? "deactivate" : "reactivate";
        modal.confirm({ // <-- Dùng instance modal
            title: `Are you sure you want to ${action} this user?`,
            onOk: async () => {
                try {
                    const token = `Bearer ${localStorage.getItem("accessToken")}`;
                    // Chỉ cần await API, không cần gán vào biến 'response'
                    await adminChangeUserStatus(userId, token); 
                    
                    // Logic tiếp theo không phụ thuộc vào response
                    message.success(`User ${action}d successfully!`);
                    fetchUsers(); // <- Đây là bước quan trọng nhất sau khi thành công
                } catch (error) {
                    console.error(`Failed to ${action} user:`, error);
                    message.error(`Failed to ${action} user.`);
                }
            },
        });
    };
    
    const handleChangeRole = async (userId, newRole) => {
        modal.confirm({ // <-- Dùng instance modal
            title: `Change user role to ${newRole}?`,
            content: 'Are you sure you want to proceed?',
            onOk: async () => {
                try {
                    const token = `Bearer ${localStorage.getItem("accessToken")}`;
                    // Chỉ cần await API
                    await adminChangeUserRole(userId, newRole, token);
                    
                    message.success(`User role changed to ${newRole} successfully!`);
                    fetchUsers();
                } catch (error) {
                    console.error('Failed to change user role:', error);
                    message.error('Failed to change user role.');
                }
            }
        });
    };

    const columns = [
        { title: 'User ID', dataIndex: 'userId', sorter: (a, b) => a.userId - b.userId },
        { title: 'Full Name', dataIndex: 'fullName', sorter: (a, b) => a.fullName.localeCompare(b.fullName) },
        { title: 'Email', dataIndex: 'email' },
        {
            title: 'Role',
            dataIndex: 'role',
            render: (role, record) => (
                <Select 
                    defaultValue={role} 
                    style={{ width: 120 }} 
                    onChange={(newRole) => handleChangeRole(record.userId, newRole)}
                    // Không cho phép thay đổi vai trò của chính mình
                    disabled={record.userId === adminUser.userId}
                >
                    <Option value="MEMBER">Member</Option>
                    <Option value="COACH">Coach</Option>
                    {/* Chỉ Admin mới thấy lựa chọn Admin, và cũng bị disable */}
                    {record.role === 'ADMIN' && <Option value="ADMIN" disabled>Admin</Option>}
                </Select>
            ),
            filters: [
                { text: 'Member', value: 'MEMBER' },
                { text: 'Coach', value: 'COACH' },
                { text: 'Admin', value: 'ADMIN' },
            ],
            onFilter: (value, record) => record.role.includes(value),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status) => (
                <Tag color={status ? 'green' : 'red'}>{status ? 'Active' : 'Inactive'}</Tag>
            ),
            filters: [
                { text: 'Active', value: true },
                { text: 'Inactive', value: false },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                // Không hiển thị nút hành động cho chính tài khoản Admin đang đăng nhập
                record.userId !== adminUser.userId &&
                <Button
                    type="link"
                    danger={record.status}
                    onClick={() => handleChangeStatus(record.userId, record.status)}
                >
                    {record.status ? 'Deactivate' : 'Reactivate'}
                </Button>
            ),
        },
    ];
    
    const filteredUsers = users.filter(user =>
        (user.fullName?.toLowerCase().includes(searchText.toLowerCase())) ||
        (user.email?.toLowerCase().includes(searchText.toLowerCase()))
    );

    return (
        <div style={{ background: '#fff', padding: 24, borderRadius: '8px' }}>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <h2 style={{margin: 0}}>User Management</h2>
                 <Search
                    placeholder="Search by name or email..."
                    onChange={e => setSearchText(e.target.value)}
                    style={{ width: 300 }}
                    allowClear
                />
            </div>
            <Table
                columns={columns}
                dataSource={filteredUsers}
                loading={loading}
                rowKey="userId"
                pagination={{ pageSize: 10 }}
                bordered
            />
            {contextHolder}
        </div>
    );
}

// Bọc component bằng <App> của Antd để cung cấp context cho modal và message
const AdminUserManagementPage = () => (
    <App>
        <AdminUserManagement />
    </App>
);

export default AdminUserManagementPage;