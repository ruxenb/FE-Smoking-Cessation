import React from "react";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import { UserProvider } from "./userContext/userContext";

import router from "./configs/router/AppRoutes";

function App() {

  return (
    /* là một React Context Provider. Nó bọc toàn bộ ứng dụng để cung cấp dữ liệu hoặc hàm liên quan đến "user" (người dùng) cho tất cả các component con bên trong. */
    /* RouterProvider là một component của React Router, giúp quản lý điều hướng (navigation) giữa các trang trong ứng dụng React */
    /* ToastContainer là một component của thư viện react-toastify, dùng để hiển thị các thông báo dạng "toast" (thường dùng thư viện như react-toastify) */
    <UserProvider>
      <RouterProvider router={router} />
      <ToastContainer />
    </UserProvider>
  );
}

export default App;
