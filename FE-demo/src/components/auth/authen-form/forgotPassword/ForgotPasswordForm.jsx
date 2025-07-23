import React from "react";
import { Button, Form, Input } from "antd";
// import "./ForgotPasswordForm.css"; // We'll create this CSS file next
import styles from "../authenForm.module.css"; // Thay đổi import
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
    <div className={styles.authContainer}>
      <div className={styles.authFormCard}>
        <div className={styles.logoContainer}>
          <Link to="/home">
            <img
              src="/images/Image2.png"
              alt="App Logo"
              className={styles.authLogo}
            />
          </Link>
        </div>
        {/* ====================================================== */}
        <h1 className={styles.authFormTitle}>Reset Password</h1>
        {/* Add a div here and apply your new class name */}
        <div className="my-custom-form">
          {" "}
          {/* Added wrapper div with new class */}
          <Form
            name="forgot_password"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="on"
          >
            <Form.Item
              label="Email"
              name="emailOrUsername"
              rules={[
                {
                  required: true,
                  message: "Please enter your email or username!",
                },
              ]}
            >
              <Input placeholder="Enter your email or username" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className={styles.authSubmitButton}
              >
                Send Reset Link
              </Button>
            </Form.Item>

            <div className={styles.authSwitchLink}>
              <span>Remember your password?</span>
              <Link to="/login">Back to Login</Link>
            </div>
          </Form>
        </div>{" "}
        {/* Close the wrapper div */}
      </div>
    </div>
  );
}

export { ForgotPasswordForm };
