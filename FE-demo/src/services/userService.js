import axios from "axios";

export const changePassword = async (userId, data, token) => {
  const url = `http://localhost:8080/api/users/${userId}/change-password`;
  return axios.put(url, data, {
    headers: {
      Authorization: token,
    },
  });
};

/* 

  return axios.put(
    `http://localhost:8080/api/users/${userId}/change-password`,
    data,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  
*/