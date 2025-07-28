import api from '../configs/api/axios'; // Đảm bảo đường dẫn này đúng

export const createPost = async (postData, token) => {
    try {
        const response = await api.post('/posts', postData);
        return response;
    } catch (error) {
        throw error;
    }
};