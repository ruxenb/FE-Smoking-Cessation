import api from '../configs/api/axios'; // Đảm bảo đường dẫn này đúng

/**
 * Gửi feedback của người dùng lên Backend.
 * @param {object} feedbackData - Đối tượng chứa thông tin feedback.
 * @param {string} feedbackData.userId - ID của người gửi feedback.
 * @param {string} feedbackData.receiverId - ID của người nhận feedback (0 nếu là hệ thống).
 * @param {string} feedbackData.subject - Chủ đề của feedback (ví dụ: "Feedback on Our System" hoặc "Feedback for Coach: [Name]").
 * @param {string} feedbackData.body - Nội dung chi tiết của feedback.
 * @param {number} feedbackData.rating - Đánh giá (từ 0 đến 5).
 * @returns {Promise<AxiosResponse>} - Promise resolve với đối tượng phản hồi từ Axios.
 */
export const submitFeedback = async (feedbackData, token) => { // THÊM THAM SỐ TOKEN
  try {
    const response = await api.post('/feedbacks', feedbackData, {
      headers: {
        Authorization: token,
      },
    });
    return response;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
};

// Hàm để lấy feedback theo receiverId
export const getFeedbacksByReceiverId = async (receiverId, token) => {
    try {
        const response = await api.get(`/feedbacks/receiver/${receiverId}`, { 
          headers : { 
            Authorization: token,
          },
        });
        return response;
    } catch (error) {
        throw error;
    }
};

// Hàm để lấy tất cả feedbacks
export const getAllFeedbacks = async (token) => {
    try {
        const response = await api.get('/feedbacks', { 
          headers : { 
            Authorization: token,
          },
        });
        return response;
    } catch (error) {
        throw error;
    }
};