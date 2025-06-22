import api from "../configs/axios";

export const registerUser = async (registerData) => {
  return await api.post(
    "http://localhost:8080/api/auth/register",
    registerData
  );
};
