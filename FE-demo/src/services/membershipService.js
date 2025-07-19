import api from "../configs/api/axios"; // Sử dụng instance axios đã cấu hình

/**
 * Lấy thông tin chi tiết của một gói thành viên bằng ID.
 * @param {number} packageId - ID của gói thành viên.
 * @param {string} token - Token xác thực của người dùng.
 * @returns {Promise} - Promise từ API call.
 */
export const getMembershipPackageById = async (packageId, token) => {
  return await api.get(
    `http://localhost:8080/api/membershippackage/${packageId}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
};

/**
 * Gọi API backend để khởi tạo một giao dịch mua hàng.
 * Backend sẽ tạo một bản ghi UserMembership với trạng thái PENDING.
 * @param {object} purchaseData - Dữ liệu chứa userId và membershipPackageId.
 * @param {string} token - Token xác thực của người dùng.
 * @returns {Promise} - Promise chứa thông tin của bản ghi UserMembership vừa được tạo.
 */
export const initiatePurchase = async (purchaseData, token) => {
  // Endpoint này phải khớp với endpoint trong UserMembershipController
  return await api.post(
    "http://localhost:8080/api/user-memberships/initiate-purchase",
    purchaseData,
    {
      headers: {
        Authorization: token,
      },
    }
  );
};
