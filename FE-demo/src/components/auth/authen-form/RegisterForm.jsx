import React, { useState } from "react";
import { Button, Form, Input, DatePicker, Select } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { BsFillPersonFill } from "react-icons/bs";
import { FaLock, FaEnvelope } from "react-icons/fa";
import "./RegisterForm.css"; // tạo file này nếu bạn muốn CSS riêng
import dayjs from "dayjs";
import { registerUser } from "/src/services/authService"; // import hàm registerUser từ file authService.js
import { toast } from "react-toastify";

function RegisterForm() {
  const [form] = Form.useForm();
  const navigate = useNavigate(); // dùng để chuyển hướng trang
  const [loading, setLoading] = useState(false); // loading khi gửi form

  // values là một object chứa các giá trị từ form
  // onFinish được gọi khi người dùng nhấn nút Register
  const onFinish = async (values) => {
    // TODO: Gọi API register ở đây
    try {
      setLoading(true); // Bật loading khi bắt đầu gửi form
      // Format lại ngày sinh trước khi gửi data về backend
      // payload là một object chứa các giá trị từ form, bao gồm cả ngày sinh đã được định dạng
      const payload = {
        ...values, // ...values có nghĩa là lấy tất cả các trường từ form
        dob: dayjs(values.dob).format(
          "YYYY-MM-DD"
        ), /* dùng thư viện dayjs để định dạng lại ngày tháng datepicker của antd */
      };
      delete payload.confirm_password; // Xoá confirm_password khỏi payload trước khi gửi về Backend  

      console.log("Payload gửi lên:", payload);

      const response = await registerUser(payload);
      if (response.status == 200 || response.status == 201) {
        toast.success("Đăng ký tài khoản thành công ^3^");
        console.log("Register success:", response.data);
        // Sau 3 giây chuyển trang
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      console.error(error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message, {
          theme: "dark",
        });
      } else {
        toast.error("Đăng ký tài khoản thất bại, vui lòng thử lại!", {
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
    <div className="register-form">
      <div className="register-form-header">
        <Link to="/home">
          <img
            src="/public/images/Image2.png"
            alt="App-Logo"
            className="app-logo"
          />
        </Link>
        <h1>Register Form</h1>
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
        {/* email */}
        <Form.Item
          label="Email"
          name="email"
          hasFeedback
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Invalid email format!" },
          ]}
        >
          <Input
            size="large"
            placeholder="Enter email"
            prefix={<FaEnvelope />}
          />
        </Form.Item>
        {/* username */}
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input
            size="large"
            placeholder="Enter username"
            prefix={<BsFillPersonFill />}
          />
        </Form.Item>
        {/* fullname */}
        <Form.Item
          label="FullName"
          name="fullName"
          rules={[{ required: true, message: "Please input your fullname" }]}
        >
          <Input
            size="large"
            placeholder="Enter Fullname"
            prefix={<BsFillPersonFill />}
          ></Input>
        </Form.Item>
        {/* password */}
        <Form.Item
          label="Password"
          name="password"
          hasFeedback /* Thuộc tính này sẽ hiện ô check box khi thỏa mãn điều kiện */
          rules={[
            { required: true, message: "Please input your password!" },
            { min: 6, message: "Password must be at least 6 characters." },
          ]}
        >
          <Input.Password
            size="large"
            placeholder="Enter password"
            prefix={<FaLock />}
          />
        </Form.Item>
        {/* confirm_password */}
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
          <Input.Password
            size="large"
            placeholder="Confirm password"
            prefix={<FaLock />}
          />
        </Form.Item>
        {/* Date Of Birth */}
        <Form.Item
          label="Date of Birth"
          name="dob"
          hasFeedback
          rules={[
            { required: true, message: "Please select your date of birth!" },
            /* Note */
            () => ({
              validator(_, value) {
                /* value là biến chứa giá trị dob người dùng chọn */
                /* Check xem dob có được nhập chưa, nếu chưa in ra thông báo missing dưới input */
                if (!value) return Promise.reject("Date of birth is missing");
                /* Check xem dob người dùng chọn có phải trong tương lai không, nếu có in ra thông báo dưới input */
                if (value.isAfter())
                  return Promise.reject(
                    "Date of birth cannot be in the future"
                  );
                const today = dayjs(); /* Lấy ngày hiện tại */
                const age = today.diff(
                  value,
                  "year"
                ); /* Tính tuổi của user sau khi chọn dob = cách lấy ngày hiện tại trừ đi ngày sinh */
                /* Xử lý đk xem người dùng trên 18 chưa */
                if (age < 18) {
                  return Promise.reject(
                    "You must be at least 18 years old to register"
                  );
                }
                /* Nếu không vướng điều kiện nào thì trả về Promise.resolve() để báo cho antd biết là không có lỗi gì - được phép submit */
                return Promise.resolve();
              },
            }),
          ]}
        >
          {/* Date Picker của Ant Design mặc định trả về một dayjs object, nên phải install thư viện dayjs để format lại trước khi gửi data về BE */}
          <DatePicker
            size="large"
            format="DD/MM/YYYY"
            placeholder="Select date of birth"
            style={{ width: "100%" }}
          />
        </Form.Item>

        {/* Gender */}
        <Form.Item
          label="Gender"
          name="gender"
          placeholder="Select your date of birth"
          rules={[{ required: true, message: "Please select your gender" }]}
        >
          <Select placeholder="Select gender">
            <Select.Option value="MALE">Male</Select.Option>
            <Select.Option value="FEMALE">Female</Select.Option>
            <Select.Option value="OTHER">Other</Select.Option>
          </Select>
        </Form.Item>
        {/* Register button */}
        <Form.Item>
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            className="login-button"
            loading={loading} // thêm dòng này
          >
            Register
          </Button>
        </Form.Item>
        {/* login link */}
        <div className="login">
          <span>Already have an account?</span>
          <Link to="/login" className="login-link">
            (Login here)
          </Link>
        </div>
        {/* Guest selection */}
        <div className="guest">
          <Link to="/home" className="guest-link">
            <span>Continue as a guest</span>
          </Link>
        </div>
      </Form>
    </div>
  );
}

export default RegisterForm;
