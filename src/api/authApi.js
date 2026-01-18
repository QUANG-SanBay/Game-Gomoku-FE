//FE gửi request đến Backend
//Nhận access_token khi đăng nhập thành công
import axios from "axios";

const API_URL = "http://localhost:8000/api";

export const loginApi = (data) => {
  return axios.post(`${API_URL}/auth/login/`, data);
};

export const registerApi = (data) => {
  return axios.post(`${API_URL}/auth/register/`, data);
};
