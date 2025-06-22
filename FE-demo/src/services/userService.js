import axios from "axios";

export const changePassword = async (userId, data, token) => {
  return axios.put(
    `http://localhost:8080/api/users/${userId}/change-password`,
    data,
    {
      headers: {
        Authorization: token,
      },
    }
  );
};
