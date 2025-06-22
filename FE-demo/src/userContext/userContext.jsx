// File này giúp bạn quản lý và chia sẻ thông tin người dùng (user) trong toàn bộ ứng dụng  một cách tiện lợi
//  đồng thời tự động lấy thông tin user từ localStorage khi app khởi động.

/* 
createContext: Tạo một Context mới.
useContext: Dùng để truy cập Context.
useState: Quản lý state cục bộ.
useEffect: Chạy code khi component mount hoặc update.
 */
import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(null); // Tạo một Context tên là UserContext với giá trị mặc định là null

// UserProvider là một component cung cấp context cho toàn bộ ứng dụng
// Nó sẽ lưu trữ thông tin người dùng và cung cấp hàm setUser để cập nhật thông tin người dùng
// Các component con có thể sử dụng useUser để truy cập thông tin người dùng và hàm setUser
// UserContext.Provider truyền xuống giá trị { user, setUser } cho các component con
export function UserProvider({ children }) {
  // Khởi tạo state user với giá trị mặc định là null
  // sử dụng React Hook useState để tạo state mới tên là user và một hàm để cập nhật nó là setUser
  // Khi muốn thay đổi giá trị của user, bạn sẽ gọi setUser(newValue) với giá trị mới
  const [user, setUser] = useState(null); // user là giá trị state hiện tại, setUser là hàm để cập nhật giá trị của user

  // Load user từ localStorage khi app khởi động
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    // Nếu storedUser không phải null, dùng JSON.parse(storedUser) để chuyển chuỗi JSON(string) thành object JavaScript
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const logout = () => {
    //localStorage.clear(); // Xóa toàn bộ thông tin người dùng khỏi localStorage
    // nên xóa từng mục cụ thể để tránh xóa nhầm dữ liệu khác
    localStorage.removeItem("accessToken");
    localStorage.removeItem("tokenType");
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    setUser(null); // Cập nhật state user về null
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook để sử dụng Context
// useUser là một hook tùy chỉnh để truy cập thông tin người dùng từ UserContext
// Nó sẽ trả về giá trị của UserContext, bao gồm thông tin người dùng và hàm setUser
export function useUser() {
  return useContext(UserContext);
}
