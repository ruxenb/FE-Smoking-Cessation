/* File cấu hình Routes */

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
function App() {
  // Tạo một router với createBrowserRouter, định nghĩa các route của ứng dụng
  // Data router api
  const router = createBrowserRouter([
    // path: Đường dẫn url của ứng dụng
    // element: Component sẽ được hiển thị khi truy cập vao path
    {
      path: "/",
      element: <LoginPage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/home",
      element: <HomePage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "/forgot_password",
      element: <ForgotPasswordPage />,
    },
  ]);
  // Sử dụng RouterProvider để cung cấp router cho toàn bộ ứng dụng
  return <RouterProvider router={router} />;
}

export default App;
