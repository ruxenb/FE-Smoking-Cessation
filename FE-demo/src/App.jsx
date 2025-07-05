/* File cấu hình Routes */

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify"; /* 20/6/2025 */
import "react-toastify/dist/ReactToastify.css"; /* 20/6/2025 */
import { UserProvider } from "./userContext/userContext";

import Dashboard from "./pages/DashboardPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import MembershipPage from "./pages/MembershipPage";
import CheckoutPage from "./pages/CheckoutPage"; 
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import AboutUsPage from "./pages/AboutUsPage";
import HomePage from "./pages/HomePage";
import SettingsPage from "./components/dashboard/sidebarPages/SettingsPage";
import CommunityPage from "./pages/CommunityPage";

import NotFoundPage from "./pages/NotFoundPage"; // Import 404 page
import ProtectedRoute from "./components/protectedRoute/protectedRoute";
import OAuth2RedirectHandler from "./components/oauth2/redirect/OAuth2RedirectHandler";

function App() {
  // Tạo một router với createBrowserRouter, định nghĩa các route của ứng dụng
  // Data router api

  // path: Đường dẫn url của ứng dụng
  // element: Component sẽ được hiển thị khi truy cập vao path
  const router = createBrowserRouter([
    { path: "/", element: <HomePage /> },
    { path: "/home", element: <HomePage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },
    { path: "/forgot", element: <ForgotPasswordPage /> },
    { path: "/membership", element: <MembershipPage /> },
    { path: "/about", element: <AboutUsPage /> },
    { path: "/community", element: <CommunityPage /> },
    { path: "/oauth2/redirect", element: <OAuth2RedirectHandler /> },
    // --- Protected Routes (yêu cầu người dùng login) ---
    // bao các page bằng ProtectedRoute component.
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/setting",
      element: (
        <ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>
      ),
    },
    //đang xem các phương án UX
    // {
    //   path: "/community",
    //   element: (
    //     <ProtectedRoute>
    //       <CommunityPage />
    //     </ProtectedRoute>
    //   ),
    // },
<<<<<<< HEAD
=======

>>>>>>> main
    // {
    //   path: "/payment-return",
    //   element: <ProtectedRoute>
    //     <PaymentReturnPage />
    //     </ProtectedRoute>
    // },

    {
      path: "/checkout/:planType", // route thanh toán
      element: (
        <ProtectedRoute>
          <CheckoutPage />
        </ProtectedRoute>
      )
    },
    //đang xem các phương án UX
    // {
    //   path: "/thank-you", // The page after a successful payment
    //   element: (
    //     <ProtectedRoute>
    //       <ThankYouPage />
    //     </ProtectedRoute>
    //   )
    // },

    // --- 404 Not Found Route ---
    // Route này phải nằm cuối array.
    // path '*'  đc xem như là wildcard, bắt những URL ko trùng bên trên above.
    { path: "*", element: <NotFoundPage /> },
  ]);
  // Sử dụng RouterProvider để cung cấp <Router> cho toàn bộ ứng dụng
  return (
    /* là một React Context Provider. Nó bọc toàn bộ ứng dụng để cung cấp dữ liệu hoặc hàm liên quan đến "user" (người dùng) cho tất cả các component con bên trong. */
    <UserProvider>
      {/* RouterProvider là một component của React Router, giúp quản lý điều hướng (navigation) giữa các trang trong ứng dụng React  */}
      <RouterProvider router={router} />
      {/* hiển thị các thông báo dạng "toast" (thường dùng thư viện như react-toastify) */}
      <ToastContainer />
    </UserProvider>
  );
}

export default App;
