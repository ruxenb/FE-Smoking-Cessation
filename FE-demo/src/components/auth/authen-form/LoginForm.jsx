import React from "react";
import { Button, Checkbox, Form, Input } from "antd";
import "./LoginForm.css";
import { Await, Link, useNavigate, useLocation } from "react-router-dom";
import FormItem from "antd/es/form/FormItem";
import { FaFacebookSquare, FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa6";
import { BsFillPersonFill } from "react-icons/bs";
import { FaLock } from "react-icons/fa";
import { BiUnderline } from "react-icons/bi";
import { UserAddOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useUser } from "/src/userContext/UserContext";
import { login } from "../../../services/authService";

function LoginForm() {
  const navigate = useNavigate(); // dùng để chuyển hướng trang
  const { setUser } = useUser(); // setUser là một để cập nhật thông tin người dùng, lấy hàm setUser từ object mà useUser() trả về
  const location = useLocation();

  /* Hàm xử lý khi nhấn nút Google */
  const hangdleGoogleLogin = () => {
    /* http://localhost:8080/oauth2/authorization/google */
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };
  /* onFinish được gọi khi người dùng nhấn nút Login */
  const onFinish = async (values) => {
    try {
      const submitData = {
        // Chuyển đổi dữ liệu đối tượng Javascript(username/email + password) thành JSON để gửi lên server
        usernameOrEmail: values.usernameOrEmail,
        password: values.password,
      };
      const response = await login(submitData);
      console.log("response:", response);
      const result = response.data;
      console.log("result:", result);

      // // Kiểm tra xem loại dữ liệu mà server trả về là gì, có chứa Content-Type hay k, có thì kiểm tra xem có phải là JSON hay không
      // const contentType = response.headers.get("Content-Type");
      // console.log("contentType:", contentType);

      // // Nếu response có Content-Type là application/json, thì parse kết quả trả về thành JSON
      // if (contentType && contentType.includes("application/json")) {
      //   result = await response.json(); // result là một đối tượng JSON, chứa dữ liệu đăng nhập trả về từ server
      // }
      // // Nếu không, thì trả về một thông báo lỗi
      // else {
      //   // nếu không phải là JSON, có thể là lỗi server hoặc không phải định dạng JSON
      //   const text = await response.text();
      //   result = { message: text };
      // }

      //Kiểm tra xem phản hồi HTTP có thành công không (status code từ 200–299) và có token được trả về hay không
      if (response.status === 200 && result.accessToken) {
        // Gộp thông tin user và thông tin gói thành viên vào một object
        const userData = {
          ...result.user, // Lấy tất cả các trường từ object user
          membership: result.currentUserMembership, // Thêm trường membership
          quitplan: result.currentQuitPlan, // Thêm trường quitPlan
        };
        // Lưu token vào localStorage để sử dụng sau này
        localStorage.setItem("accessToken", result.accessToken);
        localStorage.setItem("tokenType", result.tokenType); // "Bearer" hoặc "JWT", tuỳ backend
        // Lưu user info thành 1 object JSON vào localStorage
        localStorage.setItem("user", JSON.stringify(userData));
        // lưu thông tin user vào context
        setUser(userData);

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

        // --- LOGIC CHUYỂN HƯỚNG MỚI DỰA TRÊN DỮ LIỆU TỨC THÌ ---
        // Lấy vai trò trực tiếp từ `result.user` vừa nhận được
        const userRole = result.user.role;

        // 1. check nếu trạng trái 'from' tồn tại ở redirect.
        // 2. nếu nó tồn tại, dùng đường(path) đó.
        // 3. nếu ko, dùng default '/dashboard'.
        let defaultRedirectPath = "/home"; // Trang mặc định nếu role không xác định

        console.log("Login successful, redirecting to:", defaultRedirectPath);

        // 1. Xác định trang dashboard mặc định dựa trên role của người dùng
        if (userRole === "MEMBER") {
          defaultRedirectPath = "/dashboard";
        } else if (userRole === "COACH") {
          defaultRedirectPath = "/coach-dashboard";
        } else if (userRole === "ADMIN") {
          defaultRedirectPath = "/admin"; // Ví dụ cho admin
        }

        // 2. Lấy trang đích mà người dùng đang cố gắng truy cập (nếu có)
        const from = location.state?.from?.pathname;

        // 3. Quyết định trang cuối cùng sẽ chuyển hướng đến
        //    Ưu tiên trang `from` nếu nó tồn tại, nếu không thì dùng trang mặc định theo role.
        const destination = from || defaultRedirectPath;

        console.log(
          `Login successful. Role: ${userRole}. Redirecting to: ${destination}`
        );

        // 4. Thực hiện chuyển hướng
        navigate(destination, { replace: true });
      } else {
        // Đăng nhập sai thông tin
        console.warn("Login failed:", result.message);
        toast.error(result.message, { theme: "dark", position: "top-left" });
        // hoặc toast.error("Sai thông tin đăng nhập", vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Error Info: ", error);
      if (error.status === 404 && error.response) {
        console.warn("Login failed:", error.response);
        toast.error(error.response.data, {
          theme: "dark",
          position: "top-left",
        });
        console.log(error.response.data);
      } else if (
        /* TypeError - xảy ra khi gọi fetch() mà không kết nối được tới server - BackEnd chưa đc chạy */
        error instanceof TypeError &&
        error.message === "Failed to fetch"
      ) {
        toast.warning(
          "Lỗi Server chưa được khởi động, thử lại sau khi đã chạy hệ thống Back-End nhen 😏 ",
          { theme: "dark", position: "top-left" }
        );
      } else {
        /* Nếu kphai lỗi do chưa khởi động Back-End */
        toast.error(
          "Đã xảy ra lỗi trong quá trình đăng nhập, vui lòng thử lại sau!",
          { theme: "dark", position: "top-left" }
        );
      }
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
            <Button
              icon={<FaGoogle />}
              className="google"
              onClick={hangdleGoogleLogin}
            >
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
    </div>
  );
}

export default LoginForm;
