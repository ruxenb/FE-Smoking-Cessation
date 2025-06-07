import React from "react";
import { Button, Checkbox, Form, Input } from "antd";
import "./login.css";
import { toast } from "react-toastify";
import api from "../../configs/axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/features/userSlice";

function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    console.log("Success:", values);
    try {
      // values: thông tin người dùng nhập
      const response = await api.post("login", values);
      // lưu thông tin đăng nhập vào một redux(session) mà có thể sử dụng ở bất kỳ đâu
      dispatch(login(response.data.data));
      navigate("/dashboard");
    } catch (e) {
      console.log(e);
      // show ra màn hình cho người dùng biết lỗi
      toast.error(e.response.data);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="login-form">
      <h1>Login</h1>
      <Form
        name="basic"
        layout="vertical"
        labelCol={{ span: 24 }}
        // wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
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
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
/*******  e13bf13f-099f-463c-ae63-6c0288d5afe7  *******/

export default LoginForm;
