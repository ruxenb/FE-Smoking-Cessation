import api from "../configs/axios";

/**
 * Lấy quiz theo id, có xét token xác thực.
 * @param {string} id - ID của quiz.
 * @param {string} token - Token xác thực của người dùng.
 * @returns {Promise}
 */
export const getQuizById = async (id, token) => {
  return await api.get(`/quizzes/${id}`, {
    headers: {
      Authorization: token,
    },
  });
};

/**
 * Gửi câu trả lời quiz của người dùng lên Backend.
 * @param {object} userQuizAnswerRequestDto - Đối tượng chứa câu trả lời của người dùng.
 * @param {string} token - Token xác thực của người dùng.
 * @returns {Promise}
 */
export const submitUserQuizAnswer = async (userQuizAnswerRequestDto, token) => {
  return await api.post(`http://localhost:8080/api/users/smokingprofile/quiz-answer`, userQuizAnswerRequestDto, {
    headers: {
      Authorization: token,
    },
  });
};

// Có thể bổ sung các API khác nếu cần: getAll, ...