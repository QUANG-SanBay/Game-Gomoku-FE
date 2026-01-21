// Kiểm tra người dùng đã đăng nhập chưa
export const isLoggedIn = () => {
  return !!localStorage.getItem("access_token");
};

// Đăng xuất - xóa tất cả tokens và chuyển về trang login
export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.location.href = "/login";
};

