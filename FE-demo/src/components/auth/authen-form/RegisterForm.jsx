import React, { useState } from "react";
import { Button, Form, Input, DatePicker, Select } from "antd";
import { Link, useNavigate, useLocation  } from "react-router-dom";
import { BsFillPersonFill } from "react-icons/bs";
import { FaLock, FaEnvelope } from "react-icons/fa";
// import "./RegisterForm.css"; // tạo file này nếu bạn muốn CSS riêng
import styles from "./authenForm.module.css"; // Sửa lại import

import dayjs from "dayjs";
import { toast } from "react-toastify";
import { register } from "../../../services/authService";

function RegisterForm() {
  const [form] = Form.useForm();
  const navigate = useNavigate(); // dùng để chuyển hướng trang
  const [loading, setLoading] = useState(false); // loading khi gửi form
  const location = useLocation(); // vị trí cần tới sau khi register

  // values là một object chứa các giá trị từ form
  // onFinish được gọi khi người dùng nhấn nút Register
  const onFinish = async (values) => {
    try {
      setLoading(true); // Bật loading khi bắt đầu gửi form
      // Format lại ngày sinh trước khi gửi data về backend
      // payload là một object chứa các giá trị từ form, bao gồm cả ngày sinh đã được định dạng
      const submitData = {
        ...values, // ...values có nghĩa là lấy tất cả các trường từ form
        dob: dayjs(values.dob).format(
          "DD-MM-YYYY"
        ) /* dùng thư viện dayjs để định dạng lại ngày tháng datepicker của antd */,
      };
      // Xoá confirm_password khỏi payload trước khi gửi về Backendf
      delete submitData.confirm_password;

      console.log("Data được gửi về BE:", submitData);

      // gọi API register từ registerUser trong authService.js
      const response = await register(submitData);

      if (response.status == 200 || response.status == 201) {
        toast.success("Registration successful!");
        console.log("Register success:", response.data);
        // Sau 3 giây chuyển trang
        setTimeout(() => {
          navigate("/login", { state: location.state });  
          // { state: location.state } sau khi đăng ký sẽ đưa đến trang trước đó (trang mà cần phải đăng ký để truy cấp)
        }, 3000);
      }
    } catch (error) {
      console.error("Register thất bại", error);
      // đây là biến lưu đoạn text được trả về từ backend khi register fail
      const responseData = error.response?.data; // kiểm tra xem error.response có tồn tại không (ko bị null hoặc undefined)
      if (typeof responseData === "string") {
        // kiểm tra xem responseData được trả về từ BE có phải là chuỗi string
        toast.error(responseData, { theme: "dark" });
        console.log(responseData);
      } else {
        toast.error("Registration failed, please try again!", {
          theme: "dark",
        });
      }
    } finally {
      setLoading(false); // Tắt loading sau khi gửi form
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Register Failed:", errorInfo);
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

      <h1 className={styles.authFormTitle}>Create Account</h1>

      <Form
        form={form}
        name="register"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Invalid email format!" },
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input placeholder="Enter your username" />
        </Form.Item>
        
        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[{ required: true, message: "Please input your full name" }]}
        >
          <Input placeholder="Enter your full name" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please input your password!" },
            { min: 6, message: "Password must be at least 6 characters." },
          ]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirm_password"
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
          <Input.Password placeholder="Confirm password" />
        </Form.Item>
        
        <Form.Item
          label="Date of Birth"
          name="dob"
          rules={[
            { required: true, message: "Please select your date of birth!" },
            () => ({
              validator(_, value) {
                if (!value) return Promise.resolve();
                if (value.isAfter()) return Promise.reject("Date of birth cannot be in the future");
                if (dayjs().diff(value, "year") < 18) return Promise.reject("You must be at least 18 years old");
                return Promise.resolve();
              },
            }),
          ]}
        >
          <DatePicker format="DD/MM/YYYY" placeholder="Select date of birth" style={{ width: "100%" }}/>
        </Form.Item>

        <Form.Item
          label="Gender"
          name="gender"
          rules={[{ required: true, message: "Please select your gender" }]}
        >
          <Select placeholder="Select your gender">
            <Select.Option value="MALE">Male</Select.Option>
            <Select.Option value="FEMALE">Female</Select.Option>
            <Select.Option value="OTHER">Other</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className={styles.authSubmitButton}
            loading={loading}
          >
            Register
          </Button>
        </Form.Item>

        <div className={styles.authSwitchLink}>
          <span>Already have an account?</span>
          <Link to="/login">Login here</Link>
        </div>
      </Form>
    </div>
    </div>
  );
}

export default RegisterForm;