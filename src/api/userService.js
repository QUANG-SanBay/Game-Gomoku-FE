import axiosClient from "./axiosClient";

// Lấy bảng xếp hạng người chơi (Top ELO)
// GET /api/users/leaderboard/
// Response: [{ username, elo, wins }]
export const getLeaderboard = () => axiosClient.get("/users/leaderboard/");

// Xem profile người chơi khác
// GET /api/users/{id}/
// Response: { username, elo, wins, losses, draws, avatar, full_name }
export const getUserProfile = (userId) => axiosClient.get(`/users/${userId}/`);

// Alias cho getUserProfile để đồng nhất với tên khác
export const getUserById = getUserProfile;

// Lấy profile của bản thân
// GET /api/users/profile/
// Response: { id, full_name, username, email, wins, losses, draws, elo, avatar }
export const getMyProfile = () => axiosClient.get("/users/profile/");

// Cập nhật profile của bản thân (chỉ full_name, email, avatar)
// PUT /api/users/profile/
// Body: { full_name?, email?, avatar? } (có thể dùng FormData cho avatar)
// Response: { id, full_name, username, email, wins, losses, draws, elo, avatar }
export const updateMyProfile = (data) => {
  // Nếu có avatar thì dùng FormData
  if (data.avatar && data.avatar instanceof File) {
    const formData = new FormData();
    if (data.full_name) formData.append("full_name", data.full_name);
    if (data.email) formData.append("email", data.email);
    formData.append("avatar", data.avatar);
    return axiosClient.put("/users/profile/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  // Nếu không có avatar thì dùng JSON
  return axiosClient.put("/users/profile/", data);
};

// Lấy lịch sử các trận đấu
// GET /api/matches/history/
// Response: [{ match_id, opponent, result, time }]
export const getMatchHistory = () => axiosClient.get("/matches/history/");
