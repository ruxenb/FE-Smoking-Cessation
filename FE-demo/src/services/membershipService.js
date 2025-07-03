import api from "../configs/axios"; // Sử dụng instance axios đã cấu hình

/**
 * Lấy thông tin chi tiết của một gói thành viên bằng ID.
 * @param {number} packageId - ID của gói thành viên.
 * @param {string} token - Token xác thực của người dùng.
 * @returns {Promise} - Promise từ API call.
 */
export const getMembershipPackageById = async (packageId, token) => {
  return await api.get(`/membershippackage/${packageId}`, {
    headers: {
      Authorization: token,
    },
  });
};