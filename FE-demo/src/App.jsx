/* File cấu hình Routes */

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify"; /* 20/6/2025 */
import "react-toastify/dist/ReactToastify.css"; /* 20/6/2025 */
import { UserProvider } from "./userContext/userContext";

// Import các trang (pages) của ứng dụng

import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import MembershipPage from "./pages/MembershipPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import AboutUsPage from "./pages/AboutUsPage";
import HomePage from "./pages/HomePage";
import CommunityPage from "./pages/CommunityPage";

import BlogPage from "./pages/BlogPage";
import PostDetail from "./components/blog/PostDetail"; // Import PostDetail component
import CreatePost from "./components/blog/CreatePost";
import EditPost from "./components/blog/EditPosts"; // Import EditPost component

import SmokingQuiz from "./pages/SmokingQuizPage";
import QuitPlanPage from "./pages/QuitPlanPage";
import Feedback from "./pages/FeedbackPage";

import Dashboard from "./pages/DashboardPage";
import CheckoutPage from "./pages/CheckoutPage"; 
import SettingsPage from "./components/dashboard/sidebarPages/SettingsPage";
import CoachDashboard from "./pages/CoachDashboardPage"; // <-- Import trang mới
import ChatPage from "./components/chat/ChatPage";

import AdminLayout from "./components/admin/layout/adminLayout";
import AdminDashboard from "./components/admin/adminDashboardContent"; // Trang tổng quan
import AdminBlogManagement from "./components/admin/AdminBlogManagement"; // Trang quản lý blog


import PaymentReturnPage from "./components/checkout/paymentReturn/paymentReturn";
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
    { path: "/blog", element: <BlogPage /> },
    { path: "/blog/new", element: <ProtectedRoute><CreatePost /></ProtectedRoute> },
    { path: "/blog/:id/edit", element: <ProtectedRoute><EditPost /></ProtectedRoute> },
    { path: "/blog/:id", element: <PostDetail /> },
    // { path: "/coach-dashboard", element: <CoachDashboard /> },


    // --- Protected Routes (yêu cầu người dùng login) ---
    // bao các page bằng ProtectedRoute component.
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute allowedRoles={['MEMBER']}> 
          <Dashboard />
        </ProtectedRoute>
      ),
    },
    
    {
      path: "/smoking-quiz",
      element: (
        <ProtectedRoute>
          <SmokingQuiz />
        </ProtectedRoute>
      ),
    },
    {
      path: "/feedback",
      element: (
        <ProtectedRoute>
          <Feedback />
        </ProtectedRoute>
      ),
    },
    {
      path: "/quit-plan",
      element: (
        <ProtectedRoute>
          <QuitPlanPage/>
          </ProtectedRoute>
      ),
    },
    {
      path: "/coach-dashboard",
      element: (
        <ProtectedRoute allowedRoles={['COACH']}>
          <CoachDashboard />
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
    {
      path: "/chat",
      element: (
        <ProtectedRoute>
          <ChatPage />
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
        // --- THÊM ROUTE MỚI ĐỂ XỬ LÝ KẾT QUẢ TỪ VNPAY ---
    {
      path: "/payment-return",
      element: <ProtectedRoute><PaymentReturnPage /></ProtectedRoute>
    },
    // {
    //   path: "/payment-return",
    //   element: <ProtectedRoute>
    //     <PaymentReturnPage />
    //     </ProtectedRoute>
    // },

    {
      path: "/checkout/:planType",
      element: <ProtectedRoute><CheckoutPage /></ProtectedRoute>
    },

     {
      path: "/admin",
      element: (
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <AdminLayout />
        </ProtectedRoute>
      ),
      // Các trang con sẽ được render bên trong <Outlet /> của AdminLayout
      children: [
        {
          index: true, // Trang mặc định khi vào /admin
          element: <AdminDashboard />, 
        },
        {
          path: "blog", // URL sẽ là /admin/blog
          element: <AdminBlogManagement />,
        },
        // {
        //   path: "users", // URL sẽ là /admin/users
        //   element: <AdminUserManagement />,
        // },
      ],
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
