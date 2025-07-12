import api from "../configs/axios";

const API_BASE_URL = 'http://localhost:8080/api'; // Đảm bảo URL này khớp với backend của bạn

// Hàm lấy tất cả các phương pháp cai thuốc
export const getAllQuitMethods = async (token) => {
    return await api.get(`${API_BASE_URL}/quit-methods`, {
        headers: {
            Authorization: token,
        },
    });
};

// Hàm gửi dữ liệu Quit Plan mới
export const createQuitPlan = async (quitPlanData, token) => {
    return await api.post(`${API_BASE_URL}/quitplans`, quitPlanData, {
        headers: {
            Authorization: token,
        },
    });
};

// Hàm lấy Quit Plan hiện tại và lưu vào localStorage
export const fetchAndSaveCurrentQuitPlan = async (token) => {
  try {
    const response = await api.get(`${API_BASE_URL}/quitplans/current`, {
      headers: {
        Authorization: token,
      },
    });

    if (response.data.status === "success") {
      const quitPlan = response.data.data;

      // ✅ Cập nhật lại object user đã lưu
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (storedUser) {
        const updatedUser = {
          ...storedUser,
          quitplan: quitPlan,
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      return quitPlan;
    } else {
      console.error("Failed to fetch quit plan:", response.data.message);
      return null;
    }
  } catch (error) {
    console.error("Error fetching quit plan:", error);
    return null;
  }
};

//Hàm hủy bỏ Quit Plan
export const cancelQuitPlan = async (quitPlanId, token) => {
  return api.delete(`${API_BASE_URL}/quitplans/${quitPlanId}`, {
    headers: {
      Authorization: token,
    },
  });
};

// Hàm tạo QuitProgressLog của Quit Plan
export const saveQuitProgressLog = async (log, token) => {
  return await api.post(`${API_BASE_URL}/users/quit-progress`, log, {
        headers: {
            Authorization: token,
        },
    });
};

// Hàm cập nhật QuitProgressLog của Quit Plan
export const updateQuitProgressLog = async (logId, data, token) => {
  return await api.put(`${API_BASE_URL}/users/quit-progress/${logId}`, data, {
    headers: {
      Authorization: token,
    },
  });
};
