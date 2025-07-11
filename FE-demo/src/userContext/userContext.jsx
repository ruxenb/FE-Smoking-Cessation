// File này giúp bạn quản lý và chia sẻ thông tin người dùng (user) trong toàn bộ ứng dụng  một cách tiện lợi
//  đồng thời tự động lấy thông tin user từ localStorage khi app khởi động.

/* 
createContext: Tạo một Context mới.
useContext: Dùng để truy cập Context.
useState: Quản lý state cục bộ.
useEffect: Chạy code khi component mount hoặc update.
 */
import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, getCurrentUserMembership } from "../services/userService"; 

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

    // Thêm một state loading, mặc định là true khi app vừa khởi động
  const [loading, setLoading] = useState(true);

  // Load user từ localStorage khi app khởi động
  useEffect(() => {
    try {
    const storedUser = localStorage.getItem("user");
    // Nếu storedUser không phải null, dùng JSON.parse(storedUser) để chuyển chuỗi JSON(string) thành object JavaScript
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }catch(error){
    console.error("Failed to parse user from localStorage", error);
      // Nếu có lỗi, xóa user cũ để tránh lỗi lặp lại
      localStorage.removeItem("user");
  }finally {
      // Dù thành công hay thất bại, báo hiệu rằng quá trình tải đã xong
      setLoading(false);
    }
  }, []);

    /**
   * Gọi API để lấy dữ liệu người dùng mới nhất từ server và cập nhật state toàn cục.
   * @returns {Promise<boolean>} Trả về true nếu cập nhật thành công, false nếu thất bại.
   */
  const refreshUser = async () => {
    const tokenType = localStorage.getItem("tokenType");
    const accessToken = localStorage.getItem("accessToken");

    if (!tokenType || !accessToken) {
      console.error("No token found, cannot refresh user.");
      return false; // Không thể refresh nếu không có token
    }

    const fullToken = `${tokenType} ${accessToken}`;

    try {
      // 1. Gọi API để lấy thông tin user cơ bản (đã bao gồm smokingProfile)
      const userResponse = await getCurrentUser(fullToken);

      // Nếu API user thành công, tiến hành lấy membership
      if (userResponse.data?.status === "success") {
        const baseUser = userResponse.data.data;
        let membershipData = null;

        // 2. Gọi API để lấy thông tin membership (đây là optional)
        try {
            const membershipResponse = await getCurrentUserMembership(baseUser.userId, fullToken);
            if (membershipResponse.data?.status === "success") {
                membershipData = membershipResponse.data.data;
            }
        } catch (membershipError) {
             // Bỏ qua lỗi nếu user không có membership, đó là trường hợp bình thường
            console.log("User does not have an active membership, which is normal.");
        }
        
        // 3. Gộp dữ liệu user và membership lại
        const updatedUserData = {
          ...baseUser,
          membership: membershipData,
        };

        // 4. Cập nhật state và localStorage
        setUser(updatedUserData);
        localStorage.setItem("user", JSON.stringify(updatedUserData));

        console.log("User context refreshed successfully!");
        return true; // Trả về true báo hiệu thành công
      } else {
        throw new Error(userResponse.data?.message || "Failed to fetch user data");
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      // Nếu token hết hạn (lỗi 401), có thể tự động logout người dùng ở đây
      if (error.response?.status === 401) {
        logout();
      }
      return false; // Trả về false báo hiệu thất bại
    }
  };


  const logout = () => {
    //localStorage.clear(); // Xóa toàn bộ thông tin người dùng khỏi localStorage
    // nên xóa từng mục cụ thể để tránh xóa nhầm dữ liệu khác
    localStorage.removeItem("accessToken");
    localStorage.removeItem("tokenType");
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("quitplan");
    setUser(null); // Cập nhật state user về null
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, loading, refreshUser }}>
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
