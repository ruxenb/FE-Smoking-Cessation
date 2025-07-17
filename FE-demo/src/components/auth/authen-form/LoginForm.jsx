import React from "react";
import { Button, Checkbox, Form, Input } from "antd";
// import "./LoginForm.css";
import styles from "./authenForm.module.css"; // Thay đổi import
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

// import { useUser } from "../../../userContext/userContext";

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
      // gọi tới api từ AuthService
      const response = await login(submitData);
      console.log("response:", response);

      const result = response.data;
      console.log("result:", result);

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
        <h1 className={styles.authFormTitle}>Welcome back!</h1>

        <Form
          name="login"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="on"
        >
          <Form.Item
            label="Email"
            name="usernameOrEmail"
            rules={[
              {
                required: true,
                message: "Please input your email or username!",
              },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          {/* === PHẦN ĐƯỢC THÊM LẠI === */}
          <Form.Item>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Link
                to="/forgot"
                className={styles.authLink}
                style={{ marginTop: 0 }}
              >
                Forgot password?
              </Link>
            </div>
          </Form.Item>
          {/* =========================== */}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.authSubmitButton}
            >
              Sign In
            </Button>
          </Form.Item>

          {/* === PHẦN ĐĂNG NHẬP SOCIAL === */}
          <div className={styles.altLogin}>
            <p className={styles.altLoginTitle}>Or Login With</p>
            <div className={styles.altLoginButtons}>
              <Button
                icon={<FaGoogle />}
                className="google-btn"
                onClick={hangdleGoogleLogin}
              >
                Google
              </Button>
            </div>
          </div>
          {/* =========================================== */}

          <div className={styles.authSwitchLink}>
            <span>Don't have an account?</span>
            <Link to="/register">Sign up</Link>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default LoginForm;
