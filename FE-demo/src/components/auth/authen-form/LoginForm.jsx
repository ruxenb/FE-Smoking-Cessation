import React from "react";
import { Button, Checkbox, Form, Input } from "antd";
import "./LoginForm.css";
import { Await, Link } from "react-router-dom";
import FormItem from "antd/es/form/FormItem";
import { FaFacebookSquare, FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa6";
import { BsFillPersonFill } from "react-icons/bs";
import { FaLock } from "react-icons/fa";
import { BiUnderline } from "react-icons/bi";

function LoginForm() {
  /* onFinish được gọi khi người dùng nhấn nút Login */
  const onFinish = async (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="login-form">
      <div className="login-form-header">
        <img
          src="/public/images/Image2.png"
          alt="Logo"
          className="login-logo"
        />
        <h1>Login Form</h1>
      </div>
      <Form
        name="basic"
        layout="vertical" /* các label(nhãn) sẽ nằm phía trên các thẻ input */
        labelCol={{ span: 24 }} /* độ rộng của label */
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="on"
      >
        <Form.Item
          label="Username"
          name="username" // khi submit form, giá trị của key "username" sẽ được gửi lên server
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input
            placeholder="Enter username or email"
            prefix={<BsFillPersonFill />}
          />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Enter password" prefix={<FaLock />} />
        </Form.Item>
        {/* Remember và Forgot Password */}
        <Form.Item label={null}>
          <div className="remember-me-row">
            <Checkbox name="remember" className="remember-me">
              Remember me
            </Checkbox>
            <Link to="/forgot" className="forgot-link">
              Forgot Password?
            </Link>
          </div>
        </Form.Item>
        {/* Login Button */}
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit" className="login-button">
            Login
          </Button>
        </Form.Item>
        {/* Cài install react-icons trc khi dùng */}
        <div className="alt-login">
          <p className="alt-login-title">Or Login With</p>
          <div className="alt-login-buttons">
            <Button icon={<FaGithub />} className="github">
              GitHub
            </Button>
            <Button icon={<FaFacebookSquare />} className="facebook">
              Facebook
            </Button>
            <Button icon={<FaGoogle />} className="google">
              Google
            </Button>
          </div>
        </div>
        <div className="signup-link">
          <p>Don't have account?</p>
          <Link to="/register" className="sign-up">
            (Sign up here)
          </Link>
        </div>
      </Form>
    </div>
  );
}

export default LoginForm;
