import axios from "axios";

/* hàm xử lý đổi mật khẩu và gọi api - truyền vào các giá trị như userId, data đổi mật khẩu và token xác thực quyền */
export const changePassword = async (userId, data, token) => {
  const url = `http://localhost:8080/api/users/${userId}/change-password`;
  return axios.put(url, data, {
    headers: {
      Authorization: token,
    },
  });
};

export const updateUserProfile = async (userId, data, token) => {
  const url = `http://localhost:8080/api/users/${userId}/update-profile`;
  return axios.put(url, data, {
    headers: {
      Authorization: token,
    },
  });
};
