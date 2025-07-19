import api from "../configs/api/axios"; // Sử dụng instance axios đã cấu hình

/**
 * Gửi yêu cầu tạo smoking profile mới cho backend.
 * @param {object} profileData - Dữ liệu của profile (cigarettesPerDay, costPerPack, v.v.).
 * @param {string} token - Token xác thực của người dùng.
 * @returns {Promise} - Promise từ API call.
 */
export const createSmokingProfile = async (profileData, token) => {
  return await api.post(
    "http://localhost:8080/api/users/smokingprofile",
    profileData,
    {
      headers: {
        Authorization: token,
      },
    }
  );
};

/**
 * Gửi yêu cầu cập nhật smoking profile.
 * @param {number} profileId - ID của smoking profile cần cập nhật.
 * @param {object} profileData - Dữ liệu mới của profile.
 * @param {string} token - Token xác thực của người dùng.
 * @returns {Promise} - Promise từ API call.
 */
export const updateSmokingProfile = async (profileId, profileData, token) => {
  return await api.put(`/users/smokingprofile/${profileId}`, profileData, {
    headers: {
      Authorization: token,
    },
  });
};
