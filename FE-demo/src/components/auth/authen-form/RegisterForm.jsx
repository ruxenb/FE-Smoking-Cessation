import React from "react";
import { Button, Checkbox, Form, Input } from "antd"; 
import "./RegisterForm.css";

function RegisterForm() {
  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="register-form">
      <h1>Register Form</h1>
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
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked" label={null}>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default RegisterForm;
