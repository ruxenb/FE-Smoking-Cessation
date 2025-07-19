import api from "../configs/api/axios"; // bạn đã có axios instance

/**
 * Gọi API để lấy tất cả achievement từ server.
 * @returns {Promise} - Promise chứa danh sách achievements.
 */
export const fetchAchievements = async (token) => {
  return await api.get("/achievements", {
    headers: {
      Authorization: token,
    },
  });
};
