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
  ConfigProvider, // <-- Import ConfigProvider
  App, // <-- Import App để sửa lỗi context cho Modal
} from "antd";
import dayjs from "dayjs";
import { useUser } from "/src/userContext/UserContext";
import { toast } from "react-toastify";
import {
  changePassword,
  updateUserProfile,
} from "../../../services/userService";
import { antdTheme } from "../../../theme/antdTheme"; // <-- Import theme của bạn


const { Option } = Select;

function SettingsPage({ currentTheme, onThemeChange }) {
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);
  // Lấy thông tin người dùng từ context
  const { user, setUser } = useUser();
  const { modal } = App.useApp();

  /* được gọi khi ấn nút save changes */
  const onFinish = async (values) => {
    try {
      // log ra data được submit trong form - thứ được gửi về api của BE
      console.log("Submit Form values:", values);

      const tokenType = localStorage.getItem("tokenType");
      const accessToken = localStorage.getItem("accessToken");
      const fullToken = `${tokenType} ${accessToken}`;

      console.log("Full Token: ", fullToken);

      // gom các data của form vào biến submitData và format lại dob trước khi submit data
      const submitData = {
        email: values.email,
        fullName: values.fullName,
        dob: values.dob.format("YYYY-MM-DD"),
        gender: values.gender,
      };
      /* khai báo hàm cha onFinish là async nếu muốn dùng await */
      const response = await updateUserProfile(
        user.userId,
        submitData,
        fullToken
      );
      console.log("Response: ", response);
      if (
        response &&
        response.status === 200 &&
        response.data?.status === "success"
      ) {
        toast.success("Cập nhật thông tin người dùng thành công ^3^");

        const updatedUser = response.data.data;
        // dùng setUser để update lại thông tin của user trong userContext
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

      console.log("Response data: ", response.data);
      console.log("Updated User data: ", response.data.data);
      }
      else{
        toast.error("Đã có lỗi xảy ra khi update user");
      }
    } catch (error) {
      console.log("Response from BE:", error.response);
      // log ra response lỗi cụ thể trả về từ BE
      const responseData = error.response.data;
      console.log("Response data from BE:", responseData);
      if (responseData) {
        toast.error(responseData);
      }
      const msg = error.response.message;
      if (msg) {
        toast.error("Cập nhật thất bại !!!");
      }
    }
  };
  // Hàm xử lý đổi mật khẩu, được gọi khi ấn nút Confirm Password Change
  const handleNewPasswordSubmit = async (values) => {
    try {
      console.log(values);
      const tokenType = localStorage.getItem("tokenType");
      const accessToken = localStorage.getItem("accessToken");

      const fullToken = `${tokenType} ${accessToken}`;
      console.log("Full token:", fullToken);

      const submitData = {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      };
      // gọi changePassword trong userService.js
      const response = await changePassword(user.userId, submitData, fullToken);

      console.log("response from BE: ", response);
      toast.success("Password changed successfully ^3^");
      setIsModalOpen(false);
      modalForm.resetFields();
      form.resetFields();
    } catch (error) {
      const msg = error.response?.data || "Failed to change password";
      if (typeof msg === "string") {
        toast.error(msg);
      }
      console.error(error);
      console.warn("Response from BE: ", error.response);
      console.log(error.response.data);
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
            fullName: user.fullName,
            dob: dayjs(user.dob),
            createdAt: dayjs(user.createdAt, "DD/MM/YYYY"), // format lại date trước khi đưa vào datepicker hiển thị
            gender: user.gender,
            role: user.role,
          }}
          onFinish={onFinish}
        >
          {/* username */}
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true }]}
          >
            <Input disabled={user.role !== "ADMIN"} />
          </Form.Item>
          {/* email */}
          <Form.Item
            label="Email Address"
            name="email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
          {/* fullname */}
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          {/* dob */}
          <Form.Item
            label="Date of Birth"
            name="dob"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          {/* gender */}
          <Form.Item label="Gender" name="gender" rules={[{ required: true }]}>
            <Select>
              <Option value="MALE">MALE</Option>
              <Option value="FEMALE">FEMALE</Option>
              <Option value="OTHER">OTHER</Option>
            </Select>
          </Form.Item>
          {/* role */}
          <Form.Item
            label={<Tooltip title="This field is not editable">Role</Tooltip>}
            name="role"
          >
            <Select disabled={user.role !== "ADMIN"}>
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
            <DatePicker
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              disabled={user.role !== "ADMIN"}
            />
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
        <Form.Item>
          <Button type="primary" onClick={showModal}>
            Click here to change password
          </Button>
        </Form.Item>

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
