import axiosClient from "./axiosClient";

// Lấy danh sách phòng đang chờ
// GET /api/rooms/
// Response: [{ room_id, room_name, host_name, status, board_size, current_players, has_password }]
export const getRoomList = () => axiosClient.get("/rooms/");

// Tạo phòng mới
// POST /api/rooms/ (Backend thực tế)
// Body: { room_name, password?, board_size }
// Response: { room_id, room_name }
export const createRoom = (data) => axiosClient.post("/rooms/", data);

// Vào phòng
// POST /api/rooms/join/ (Backend thực tế)
// Body: { room_id, password? }
// Response: { room_id, room_name, host_name, player_2_name, status, board_size, current_players, has_password }
export const joinRoom = (data) => axiosClient.post("/rooms/join/", data);

// Rời phòng
// POST /api/rooms/leave/
// Body: { room_id }
// Response: { detail: "Phòng đã bị xóa do host rời." } hoặc { detail: "Bạn đã rời phòng." }
export const leaveRoom = (data) => axiosClient.post("/rooms/leave/", data);
