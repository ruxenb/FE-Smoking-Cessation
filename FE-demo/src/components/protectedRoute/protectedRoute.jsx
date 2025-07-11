// file này sẽ check user đã login chưa
// nếu đã login thì show page, ko thì redirect về login page
//pass luôn cái trang mà muốn truy cấp (VD: membership checkout)
import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useUser } from "/src/userContext/userContext";

const ProtectedRoute = ({ children, allowedRoles  }) => {
  const { user, loading } = useUser(); // lấy user từ context
  const location = useLocation(); // lấy vị trí hiện tại (trang web) của object

  if (loading) {
    // Có thể thay thế bằng một component Spinner đẹp hơn
    return <div>Loading...</div>;
  }

  // Check nếu user object tồn tại (nghĩa là đã log in)
  if (!user) {
    // nếu chưa log in , redirect tới /login và /register page kết hợp.
    // pass current location trong `state` property.
    // nó sẽ báo login page nơi gửi user tới page ban đầu sau khi thành công.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Nếu vai trò không được phép, chuyển hướng về trang chủ hoặc trang 403 (Unauthorized)
    console.warn(`Access denied. User role: ${user.role}, Allowed roles: ${allowedRoles}`);
    return <Navigate to="/home" replace />; // Hoặc tới một trang "/unauthorized"
  }

  // Nếu đã login, render component.
  return children;
};

export default ProtectedRoute;