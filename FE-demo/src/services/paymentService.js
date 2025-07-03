import api from "../configs/axios";

/**
 * Gọi API backend để tạo yêu cầu thanh toán VNPay.
 * Backend sẽ tạo một bản ghi UserMembership mới và trả về URL thanh toán.
 * @param {object} paymentData - Dữ liệu yêu cầu, chứa userId và membershipPackageId.
 * @param {string} token - Token xác thực của người dùng.
 * @returns {Promise} - Promise chứa URL thanh toán từ VNPay.
 */
export const createVnPayPayment = async (paymentData, token) => {
  return await api.post("/payment/create", paymentData, {
    headers: {
      Authorization: token,
    },
  });
};