import axiosClient from "./axiosClient";

// Đăng ký tài khoản mới
// POST /api/auth/register/
// Body: { full_name, email, password, confirm_password }
// Response: { user_id, message, access, refresh }
export const register = (data) => axiosClient.post("/auth/register/", data);

// Đăng nhập
// POST /api/auth/login/
// Body: { email, password }
// Response: { access_token, refresh_token }
export const login = async (data) => {
  const response = await axiosClient.post("/auth/login/", data);
  // Lưu tokens vào localStorage
  // Backend trả về access_token và refresh_token (có dấu gạch dưới)
  if (response.data.access_token) {
    localStorage.setItem("access_token", response.data.access_token);
  }
  if (response.data.refresh_token) {
    localStorage.setItem("refresh_token", response.data.refresh_token);
  }
  return response;
};

// Đăng xuất
// POST /api/auth/logout/
// Body: { refresh_token }
// Response: { message: "Success" }
export const logout = async () => {
  const refreshToken = localStorage.getItem("refresh_token");
  try {
    await axiosClient.post("/auth/logout/", { refresh: refreshToken });
  } finally {
    // Xóa tokens dù API có lỗi hay không
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
};

// Refresh access token
// POST /api/auth/refresh/
// Body: { refresh }
// Response: { access }
export const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token");
  const response = await axiosClient.post("/auth/refresh/", {
    refresh: refreshToken,
  });
  if (response.data.access) {
    localStorage.setItem("access_token", response.data.access);
  }
  return response;
};

// Lấy thông tin user hiện tại
// GET /api/auth/me/
// Response: { id, email, full_name, username, elo, wins, losses, draws, avatar }
export const getCurrentUser = () => axiosClient.get("/auth/me/");
