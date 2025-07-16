import api from "../configs/axios";

export const register = async (registerData) => {
  return await api.post(
    "http://localhost:8080/api/auth/register",
    registerData
  );
};

export const login = async (loginData) => {
  return await api.post("http://localhost:8080/api/auth/login", loginData);
};

