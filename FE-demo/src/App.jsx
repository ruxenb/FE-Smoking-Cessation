/* File cấu hình Routes */

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/DashboardPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import MembershipPage from "./pages/MembershipPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import AboutUsPage from "./pages/AboutUsPage";
import HomePage from "./pages/HomePage"
import { ToastContainer } from "react-toastify"; /* 20/6/2025 */
import "react-toastify/dist/ReactToastify.css"; /* 20/6/2025 */
import { UserProvider } from "./userContext/userContext";
import SettingsPage from "./components/dashboard/sidebarPages/SettingsPage";
function App() {
  // Tạo một router với createBrowserRouter, định nghĩa các route của ứng dụng
  // Data router api

  // path: Đường dẫn url của ứng dụng
  // element: Component sẽ được hiển thị khi truy cập vao path
  const router = createBrowserRouter([
    { path: "/", element: <HomePage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },
    { path: "/forgot", element: <ForgotPasswordPage /> },
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/membership", element: <MembershipPage /> },
    { path: "/about", element: <AboutUsPage /> },
    { path: "/setting", element: <SettingsPage />},
    
  ]);
  // Sử dụng RouterProvider để cung cấp <Router> cho toàn bộ ứng dụng
  return (
    <UserProvider> {/* là một React Context Provider. Nó bọc toàn bộ ứng dụng để cung cấp dữ liệu hoặc hàm liên quan đến "user" (người dùng) cho tất cả các component con bên trong. */}
      <RouterProvider router={router} /> {/* RouterProvider là một component của React Router, giúp quản lý điều hướng (navigation) giữa các trang trong ứng dụng React */}
      <ToastContainer /> {/* hiển thị các thông báo dạng "toast" (thường dùng thư viện như react-toastify) */}
    </UserProvider>
  );
} 

export default App;
