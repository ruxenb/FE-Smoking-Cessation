import axios from "axios";
import api from "../configs/api/axios"; // Giả sử bạn có file cấu hình axios chung

/* hàm xử lý đổi mật khẩu và gọi api - truyền vào các giá trị như userId, data đổi mật khẩu và token xác thực quyền */
export const changePassword = async (userId, data, token) => {
  const url = `http://localhost:8080/api/users/${userId}/change-password`;
  return axios.put(url, data, {
    headers: {
      Authorization: token,
    },
  });
};

export const updateUserProfile = async (userId, data, token) => {
  const url = `http://localhost:8080/api/users/${userId}/update-profile`;
  return axios.put(url, data, {
    headers: {
      Authorization: token,
    },
  });
};

/**
 * Lấy thông tin chi tiết của người dùng đang đăng nhập.
 * Yêu cầu phải có token xác thực trong header.
 * @param {string} token - Token xác thực đầy đủ (ví dụ: "Bearer eyJhbGciOiJI...")
 * @returns {Promise} - Promise từ API call.
 */
export const getCurrentUser = async (token) => {
  return await api.get("http://localhost:8080/api/users/current-user", {
    headers: {
      Authorization: token,
    },
  });
};

/**
 * Lấy thông tin gói thành viên hiện tại (ACTIVE) của người dùng.
 * @param {number} userId - ID của người dùng
 * @param {string} token - Token xác thực
 * @returns {Promise}
 */
export const getCurrentUserMembership = async (userId, token) => {
  // Lưu ý: Endpoint này có thể cần được tạo hoặc đã có sẵn trong backend
  // Dựa trên code của bạn, nó là: /api/user-memberships/user/{userId}/currentmembership
  return await api.get(
    `http://localhost:8080/api/user-memberships/user/${userId}/currentmembership`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
};
