import React from "react";
import { Button, Form, Input } from "antd";
import "./ForgotPasswordForm.css"; // We'll create this CSS file next
import { Link } from "react-router-dom";
import { BsFillPersonFill } from "react-icons/bs"; // Using person icon for email/username

function ForgotPasswordForm() {
  const onFinish = async (values) => {
    console.log("Password reset requested for:", values);
    alert(
      "If an account with that email exists, a password reset link has been sent!"
    );
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-header">
        <Link to="/home">
          <img
            src="/public/images/Image2.png"
            alt="Logo"
            className="forgot-password-logo"
          />
        </Link>
        <h1>Forgot Password</h1>
      </div>
      {/* Add a div here and apply your new class name */}
      <div className="my-custom-form">
        {" "}
        {/* Added wrapper div with new class */}
        <Form
          name="forgot_password"
          layout="vertical"
          labelCol={{ span: 24 }}
          style={{ maxWidth: 600 }} // This style applies to the Ant Design Form's inline style
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="on"
        >
          <Form.Item
            /* Style trực tiếp label thay vì dùng classname */
            label={<span style={{ fontWeight: "bold" }}>Email or Password</span>}
            name="emailOrUsername"
            rules={[
              {
                required: true,
                message: "Please enter your email or username!",
              },
            ]}
          >
            <Input
              placeholder="Enter your email or username"
              prefix={<BsFillPersonFill />}
            />
          </Form.Item>

          <Form.Item>
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
      </div>{" "}
      {/* Close the wrapper div */}
    </div>
  );
}

export default ForgotPasswordForm;
