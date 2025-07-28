import api from "../configs/api/axios";

/**
 * [Admin] Lấy tất cả các bài đăng trên hệ thống để quản lý.
 * @param {string} token - Token xác thực của Admin.
 * @returns {Promise}
 */
export const adminGetAllPosts = async (token) => {
  // --- SỬA LẠI ĐỂ GỌI ENDPOINT MỚI ---
  return await api.get("/admin/posts/all", {
    headers: { Authorization: token },
  });
};
/**
 * [Admin] Xóa một bài đăng theo ID.
 * Backend cần được phân quyền để chỉ Admin mới thực hiện được hành động này.
 * @param {number} postId - ID của bài đăng cần xóa.
 * @param {string} token - Token xác thực của Admin.
 * @returns {Promise}
 */
export const adminDeletePost = async (postId, token) => {
  return await api.delete(`/posts/${postId}`, {
    headers: { Authorization: token },
  });
};

/**
 * [Admin] Khôi phục (hiện lại) một bài đăng đã bị ẩn.
 * @param {number} postId - ID của bài đăng cần khôi phục.
 * @param {string} token - Token xác thực của Admin.
 * @returns {Promise}
 */
export const adminRestorePost = async (postId, token) => {
  // Gọi đến endpoint mới mà chúng ta đã tạo ở backend
  return await api.post(`/posts/${postId}/restore`, null, {
    headers: { Authorization: token },
  });
};

/**
 * [Admin] Xóa một bình luận theo ID.
 * Backend cần được phân quyền để chỉ Admin mới thực hiện được hành động này.
 * @param {number} commentId - ID của bình luận cần xóa.
 * @param {string} token - Token xác thực của Admin.
 * @returns {Promise}
 */
export const adminDeleteComment = async (commentId, token) => {
  return await api.delete(`/comments/${commentId}`, {
    headers: { Authorization: token },
  });
};

/**
 * [Admin] Lấy dữ liệu thống kê cho trang Dashboard.
 * @param {string} token - Token xác thực của Admin.
 * @returns {Promise}
 */
export const getAdminDashboardStats = async (token) => {
  // Thay thế bằng endpoint thực tế của bạn
  return await api.get("/admin/dashboard-stats", {
    headers: { Authorization: token },
  });
};

/**
 * [Admin] Lấy danh sách tất cả người dùng.
 * @param {string} token - Token xác thực của Admin.
 * @returns {Promise}
 */
export const adminGetAllUsers = async (token) => {
  // Gọi đến endpoint GET /api/users đã có sẵn
  return await api.get("/users", {
    headers: { Authorization: token },
  });
};

/**
 * [Admin] Thay đổi trạng thái của một người dùng (active/inactive).
 * @param {number} userId - ID của người dùng.
 * @param {string} token - Token xác thực của Admin.
 * @returns {Promise}
 */
export const adminChangeUserStatus = async (userId, token) => {
  return await api.put(`/admin/users/${userId}/change-status`, null, {
    headers: { Authorization: token },
  });
};

/**
 * [Admin] Thay đổi vai trò của một người dùng.
 * @param {number} userId - ID của người dùng.
 * @param {string} newRole - Vai trò mới ('MEMBER', 'COACH').
 * @param {string} token - Token xác thực của Admin.
 * @returns {Promise}
 */
export const adminChangeUserRole = async (userId, newRole, token) => {
  return await api.put(
    `/admin/users/${userId}/change-role`,
    { role: newRole },
    {
      headers: { Authorization: token },
    }
  );
};

/**
 * [Admin] Lấy danh sách tất cả các gói thành viên.
 */
export const adminGetAllPackages = async (token) => {
    return await api.get('/membershippackage', {
        headers: { Authorization: token }
    });
};

/**
 * [Admin] Tạo một gói thành viên mới.
 */
export const adminCreatePackage = async (packageData, token) => {
    return await api.post('/membershippackage', packageData, {
        headers: { Authorization: token }
    });
};

/**
 * [Admin] Cập nhật một gói thành viên.
 */
export const adminUpdatePackage = async (packageId, packageData, token) => {
    return await api.put(`/membershippackage/${packageId}`, packageData, {
        headers: { Authorization: token }
    });
};

/**
 * [Admin] Vô hiệu hóa một gói thành viên.
 */
export const adminDeactivatePackage = async (packageId, token) => {
    return await api.delete(`/membershippackage/${packageId}`, {
        headers: { Authorization: token }
    });
};