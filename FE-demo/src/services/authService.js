import api from "../configs/axios";

export const registerUser = async (userData) => {
  return await api.post("/auth/register", userData);
};
