import api from '../configs/axios';

/**
 * [Admin] Lấy tất cả các bài đăng trên hệ thống để quản lý.
 * @param {string} token - Token xác thực của Admin.
 * @returns {Promise}
 */
export const adminGetAllPosts = async (token) => {
    // Chúng ta dùng lại endpoint GET /api/posts vì nó trả về tất cả bài đăng
    return await api.get('/posts', {
        headers: { Authorization: token }
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
        headers: { Authorization: token }
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
        headers: { Authorization: token }
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
        headers: { Authorization: token }
    });
};

/**
 * [Admin] Lấy dữ liệu thống kê cho trang Dashboard.
 * @param {string} token - Token xác thực của Admin.
 * @returns {Promise}
 */
export const getAdminDashboardStats = async (token) => {
    // Thay thế bằng endpoint thực tế của bạn
    return await api.get('/admin/dashboard-stats', { 
        headers: { Authorization: token }
    });
};