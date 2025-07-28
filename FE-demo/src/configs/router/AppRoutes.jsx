import { createBrowserRouter } from "react-router-dom";
import HomePage from "../../pages/HomePage";
import LoginPage from "../../pages/LoginPage";
import RegisterPage from "../../pages/RegisterPage";
import ForgotPasswordPage from "../../pages/ForgotPasswordPage";
import MembershipPage from "../../pages/MembershipPage";
import AboutUsPage from "../../pages/AboutUsPage";
import OAuth2RedirectHandler from "../../components/GoogleAuthen/OAuth2RedirectHandler";
import PostDetail from "../../components/blog/PostDetail";
import ProtectedRoute from "./ProtectRouter";
import CreatePost from "../../components/blog/CreatePost";
import EditPost from "../../components/blog/EditPosts";
import Dashboard from "../../pages/MemberDashboardPage";
import SmokingQuiz from "../../pages/SmokingQuizPage";
import Feedback from "../../pages/FeedbackPage";
import QuitPlanPage from "../../components/quitPlan/QuitPlanPage";
import CoachDashboard from "../../pages/CoachDashboardPage";
import SettingsPage from "../../components/dashboard/sidebarPages/SettingsPage";
import ChatPage from "../../components/chat/ChatPage";
import PaymentReturnPage from "../../components/checkout/paymentReturn/paymentReturn";
import CheckoutPage from "../../pages/CheckoutPage";
import AdminLayout from "../../components/admin/layout/adminLayout";
import AdminDashboard from "../../components/admin/adminDashboardContent";
import AdminBlogManagementPage from "../../components/admin/AdminBlogManagement";
import AdminUserManagementPage from "../../components/admin/userManagement";
import AdminAchievementManagementPage from "../../components/admin/AdminAchievementManagement";
import AdminFeedback from "../../components/admin/AdminFeedback";
import AdminMembershipManagementPage from "../../components/admin/AdminMembershipManagement";
import NotFoundPage from "../../pages/ErrorPage/NotFoundPage";
import BlogPage from "../../pages/BlogPage";

const publicRoutes = [
  { path: "/", element: <HomePage /> },
  { path: "/home", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/forgot", element: <ForgotPasswordPage /> },
  { path: "/membership", element: <MembershipPage /> },
  { path: "/about", element: <AboutUsPage /> },
  { path: "/oauth2-redirect", element: <OAuth2RedirectHandler /> },
  { path: "/blog", element: <BlogPage /> },
  { path: "/blog/:id", element: <PostDetail /> },
];

const blogRoutes = [
  {
    path: "/blog/new",
    element: (
      <ProtectedRoute>
        <CreatePost />
      </ProtectedRoute>
    ),
  },
  {
    path: "/blog/:id/edit",
    element: (
      <ProtectedRoute>
        <EditPost />
      </ProtectedRoute>
    ),
  },
];

const protectedRoutes = [
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["MEMBER"]}>
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
        <QuitPlanPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/coach-dashboard",
    element: (
      <ProtectedRoute allowedRoles={["COACH"]}>
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
  {
    path: "/payment-return",
    element: (
      <ProtectedRoute>
        <PaymentReturnPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/checkout/:planType",
    element: (
      <ProtectedRoute>
        <CheckoutPage />
      </ProtectedRoute>
    ),
  },
];

const adminRoutes = {
  path: "/admin",
  element: (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminLayout />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <AdminDashboard /> },
    { path: "blog", element: <AdminBlogManagementPage /> },
    { path: "users", element: <AdminUserManagementPage /> },
    { path: "achievements", element: <AdminAchievementManagementPage /> },
    { path: "showFeedbacks", element: <AdminFeedback /> },
    { path: "memberships", element: <AdminMembershipManagementPage />,},
  ],
};

const router = createBrowserRouter([
  ...publicRoutes,
  ...blogRoutes,
  ...protectedRoutes,
  adminRoutes,
  { path: "*", element: <NotFoundPage /> },
]);

export default router;
