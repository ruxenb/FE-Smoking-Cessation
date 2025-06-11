import React from "react";
import { Button, Form, Input, DatePicker } from "antd";
import { Link } from "react-router-dom";
import { BsFillPersonFill } from "react-icons/bs";
import { FaLock, FaEnvelope } from "react-icons/fa";
import "./RegisterForm.css"; // tạo file này nếu bạn muốn CSS riêng

function RegisterForm() {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Register Success:", values);
    // TODO: Gọi API register ở đây
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Register Failed:", errorInfo);
  };

  return (
    <div className="register-form">
      <div className="register-form-header">
        <img
          src="/public/images/Image2.png"
          alt="Logo"
          className="login-logo"
        />
        <h1>Register</h1>
      </div>

      <Form
        form={form}
        name="register"
        layout="vertical"
        labelCol={{ span: 24 }}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="on"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Invalid email format!" },
          ]}
        >
          <Input placeholder="Enter email" prefix={<FaEnvelope />} />
        </Form.Item>

        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input placeholder="Enter username" prefix={<BsFillPersonFill />} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please input your password!" },
            { min: 6, message: "Password must be at least 6 characters." },
          ]}
        >
          <Input.Password placeholder="Enter password" prefix={<FaLock />} />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirm"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Please confirm your password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("Passwords do not match!");
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm password" prefix={<FaLock />} />
        </Form.Item>

        <Form.Item
          label="Date of Birth"
          name="dob"
          rules={[
            { required: true, message: "Please select your date of birth!" },
          ]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-button">
            Register
          </Button>
        </Form.Item>

        <div className="signup-link">
          <p>Already have an account?</p>
          <Link to="/login" className="sign-up">
            (Login here)
          </Link>
        </div>
      </Form>
    </div>
  );
}

export default RegisterForm;
