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