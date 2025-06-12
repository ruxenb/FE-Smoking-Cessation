import React from "react";
import { Button, Form, Input } from "antd";
import "./ForgotPasswordForm.css"; // We'll create this CSS file next
import { Link } from "react-router-dom";
import { BsFillPersonFill } from "react-icons/bs"; // Using person icon for email/username

function ForgotPasswordForm() {
  /* onFinish will be called when the user clicks the "Send Reset Link" button */
  const onFinish = async (values) => {
    console.log("Password reset requested for:", values);
    // Here you would typically send an API request to your backend
    // to handle the password reset process (e.g., sending an email with a reset link).
    alert("If an account with that email exists, a password reset link has been sent!");
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-header">
        <img
          src="/public/images/Image2.png" // Use your actual logo path
          alt="Logo"
          className="forgot-password-logo"
        />
        <h1>Forgot Password</h1>
      </div>
      <Form
        name="forgot_password"
        layout="vertical"
        labelCol={{ span: 24 }}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="on"
      >
        <Form.Item
          label="Email or Username"
          name="emailOrUsername"
          rules={[
            { required: true, message: "Please enter your email or username!" },
            // You can add more specific rules for email format if needed, e.g.:
            // { type: 'email', message: 'The input is not valid E-mail!' }
          ]}
        >
          <Input
            placeholder="Enter your email or username"
            prefix={<BsFillPersonFill />}
          />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit" className="reset-button">
            Send Reset Link
          </Button>
        </Form.Item>

        <div className="back-to-login">
          <p>Remember your password?</p>
          <Link to="/login" className="login-link">
            (Back to Login)
          </Link>
        </div>
      </Form>
    </div>
  );
}

export default ForgotPasswordForm;