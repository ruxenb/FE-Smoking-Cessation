import React from "react";
import {
  Modal,
  Card,
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import { useUser } from "/src/userContext/UserContext";
import { toast } from "react-toastify";

const { Option } = Select;

function SettingsPage({ currentTheme, onThemeChange }) {
  const [form] = Form.useForm();

  const [modalForm] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  // Giả sử bạn có sẵn dữ liệu user (sau này bạn sẽ fetch từ API)
  const userData = {
    username: "Alex",
    email: "alex@example.com",
    fullname: "Alex Johnson",
    password: "password123", // trong thực tế không nên show thế này
    createdAt: "2025-06-20",
    dob: "2000-01-01",
    gender: "male",
    role: "user",
  };

  // Lấy thông tin người dùng từ context
  const { user } = useUser();

  const onFinish = (values) => {
    console.log("Form values:", values);
    // Gửi API cập nhật hồ sơ người dùng tại đây
  };
  // ✅ Hàm xử lý đổi mật khẩu
  const handleNewPasswordSubmit = async (values) => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem(
              "tokenType"
            )} ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            userId: user.userId,
            currentPassword: form.getFieldValue("currentPassword"),
            newPassword: values.newPassword,
          }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        toast.success("Password changed successfully!");
        setIsModalOpen(false);
        modalForm.resetFields();
        form.resetFields(); // clear current password too
      } else {
        toast.error(result.message || "Failed to change password.");
      }
    } catch (error) {
      toast.error("Error occurred!");
      console.error(error);
    }
  };
  return (
    <div className="main-content" style={{ padding: 32 }}>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>Settings</h1>

      {/* Appearance Section */}
      <Card title="Appearance" style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 16 }}>Select Theme:</p>
        <Button
          type={currentTheme === "light" ? "primary" : "default"}
          onClick={() => onThemeChange("light")}
          style={{ marginRight: 10 }}
        >
          ☀️ Light
        </Button>
        <Button
          type={currentTheme === "dark" ? "primary" : "default"}
          onClick={() => onThemeChange("dark")}
        >
          🌙 Dark
        </Button>
      </Card>

      {/* Profile Section */}
      <Card title="Profile">
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            username: user.username,
            email: user.email,
            fullname: user.fullName,
            dob: dayjs(user.dob),
            createdAt: dayjs(userData.createdAt),
            gender: user.gender,
            role: user.role,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Email Address"
            name="email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Full Name"
            name="fullname"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Date of Birth"
            name="dob"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Gender" name="gender" rules={[{ required: true }]}>
            <Select>
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label={<Tooltip title="This field is not editable">Role</Tooltip>}
            name="role"
          >
            <Select disabled>
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={
              <Tooltip title="This field is not editable">Created At</Tooltip>
            }
            name="createdAt"
          >
            <Input disabled />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Card>
      {/* Change password section */}
      <Card title="Change Password" style={{ marginTop: 24 }}>
        <Form layout="vertical" form={form}>
          <Form.Item>
            <Button type="primary" onClick={showModal}>
              Click here to change password
            </Button>
          </Form.Item>
        </Form>

        <Modal
          title="Set New Password"
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
          // destroyOnClose
        >
          <Form
            layout="vertical"
            form={modalForm}
            onFinish={handleNewPasswordSubmit}
          >
            <Form.Item
              label="Current Password"
              name="currentPassword"
              rules={[
                { required: true, message: "Please enter current password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                { required: true, message: "Please enter new password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Confirm New Password"
              name="confirmPassword"
              dependencies={["newPassword"]}
              rules={[
                {
                  required: true,
                  message: "Please confirm your new password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Confirm Password Change
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
}

export default SettingsPage;

/* 

import React from "react";
import { Card, Form, Input, Button, Switch } from "antd";

function SettingsPage({ currentTheme, onThemeChange }) {
  const [form] = Form.useForm();

  return (
    <div className="main-content" style={{ padding: 32 }}>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>Settings</h1>

      <Card title="Theme" style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 16 }}>Select theme</p>
        <Switch
          checked={currentTheme === "dark"}
          checkedChildren="Dark"
          unCheckedChildren="Light"
          onChange={(checked) => onThemeChange(checked ? "dark" : "light")}
        />
      </Card>

      <Card title="Profile">
        <Form layout="vertical" form={form}>
          <Form.Item label="Username" name="username" initialValue="Alex">
            <Input />
          </Form.Item>
          <Form.Item
            label="Email Address"
            name="email"
            initialValue="alex@example.com"
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary">Save Changes</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default SettingsPage;


 */
