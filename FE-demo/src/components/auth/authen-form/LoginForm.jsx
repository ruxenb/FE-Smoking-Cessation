import React from "react";
import { Button, Checkbox, Form, Input } from "antd";
import "./LoginForm.css";
import { Await, Link, useNavigate } from "react-router-dom";
import FormItem from "antd/es/form/FormItem";
import { FaFacebookSquare, FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa6";
import { BsFillPersonFill } from "react-icons/bs";
import { FaLock } from "react-icons/fa";
import { BiUnderline } from "react-icons/bi";
import { UserAddOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useUser } from "/src/userContext/UserContext";

function LoginForm() {
  const navigate = useNavigate(); // dùng để chuyển hướng trang
  const { setUser } = useUser(); // setUser là một để cập nhật thông tin người dùng, lấy hàm setUser từ object mà useUser() trả về

  /* onFinish được gọi khi người dùng nhấn nút Login */
  const onFinish = async (values) => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        // gửi HTTP Request đến địa chỉ API phía server backend)
        method: "POST", // phương thức HTTP là POST
        headers: {
          "Content-Type": "application/json", // Báo cho server biết rằng dữ liệu gửi lên là JSON
        },
        // Chuyển đổi dữ liệu đối tượng Javascript(username/email + password) thành JSON để gửi lên server
        body: JSON.stringify({
          usernameOrEmail: values.usernameOrEmail,
          password: values.password,
        }),
      });
      // Kiểm tra xem loại dữ liệu mà server trả về là gì, có chứa Content-Type hay k, có thì kiểm tra xem có phải là JSON hay không
      const contentType = response.headers.get("Content-Type");
      console.log("contentType:", contentType);
      let result;
      // Nếu response có Content-Type là application/json, thì parse kết quả trả về thành JSON
      if (contentType && contentType.includes("application/json")) {
        result = await response.json(); // result là một đối tượng JSON, chứa dữ liệu đăng nhập trả về từ server
      }
      // Nếu không, thì trả về một thông báo lỗi
      else {
        // nếu không phải là JSON, có thể là lỗi server hoặc không phải định dạng JSON
        const text = await response.text();
        result = { message: text };
      }
      console.log("response:", response);
      console.log("result:", result);
      //Kiểm tra xem phản hồi HTTP có thành công không (status code từ 200–299) và có token được trả về hay không
      if (response.ok && result.accessToken) {
        // Lưu token vào localStorage để sử dụng sau này
        localStorage.setItem("accessToken", result.accessToken);
        localStorage.setItem("tokenType", result.tokenType); // "Bearer" hoặc "JWT", tuỳ backend
        // Lưu user info thành 1 object JSON vào localStorage
        localStorage.setItem("user", JSON.stringify(result.user));
        // lưu thông tin user vào context
        setUser(result.user);

        localStorage.setItem("username", result.user.username); // hoặc email, tuỳ backend
        localStorage.setItem("email", result.user.email); //
        // "Login Successfully ^3^"
        toast.success("Login Successfully ^3^", {
          position: "top-right", // hoặc "top-center", "bottom-left",...
          autoClose: 6000, // thời gian tự động đóng (ms)
          hideProgressBar: false, // ẩn/hiện progress bar
          closeOnClick: true, // click để đóng thông báo
          pauseOnHover: true,
          draggable: true, // có thể kéo thông báo để đóng
          progress: undefined,
          theme: "dark", // hoặc "dark", "colored"
          toastClassName: "success-toast",
        });
        // log lại thông tin đã được dùng để đăng nhập thành công
        console.log("Login Successfully:", values);
        // Chuyển trang qua trang chính sau khi đăng nhập thành công
        navigate("/dashboard");
      } else {
        // Đăng nhập sai thông tin
        console.warn("Login failed:", result.message);
        toast.error(result.message, { theme: "dark", position: "top-left" });
        // hoặc toast.error("Sai thông tin đăng nhập", vui lòng thử lại!");
      }
    } catch (error) {
      toast.error(
        "Đã xảy ra lỗi trong quá trình đăng nhập, vui lòng thử lại sau!"
      );
      console.error("Login error:", error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="login-form">
      <div className="login-form-header">
        <Link to="/home">
          <img src="/images/Image2.png" alt="App-Logo" className="app-logo" />
        </Link>
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
        {/* username */}
        <Form.Item
          label={
            <span style={{ fontWeight: "bold", fontSize: "14px" }}>
              Username
            </span>
          }
          name="usernameOrEmail" // khi submit form, giá trị của key "username" sẽ được gửi lên server
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input
            placeholder="Enter username or email"
            prefix={<BsFillPersonFill />}
            className="username-input"
          />
        </Form.Item>
        {/* password */}
        <Form.Item
          label={
            <span style={{ fontWeight: "bold", fontSize: "14px" }}>
              Password
            </span>
          }
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password
            placeholder="Enter password"
            prefix={<FaLock />}
            className="password-input"
          />
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
        {/* Github,gg,fb login */}
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
        {/* register link */}
        <div className="register">
          <UserAddOutlined style={{ fontSize: 18, color: "#2e7d32" }} />
          <span>Don't have an account?</span>
          <Link to="/register" className="register-link">
            Sign up here
          </Link>
        </div>
      </Form>
      {/* About Us link */}
      <div className="about-us">
        <p>Want to know more about us?</p>
        <Link to="/about">About Us</Link>
      </div>
    </div>
  );
}

export default LoginForm;
