import axiosClient from "./axiosClient";

export const login = (data) => axiosClient.post("/login/", data);
export const register = (data) => axiosClient.post("/register/", data);
