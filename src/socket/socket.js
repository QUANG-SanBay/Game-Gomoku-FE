import { io } from "socket.io-client";

// Khởi tạo Socket.IO client với authentication
const socket = io("http://localhost:8000", {
  transports: ["websocket"],
  autoConnect: false,
  auth: (cb) => {
    // Lấy token từ localStorage khi connect
    const token = localStorage.getItem("access_token");
    cb({ token });
  },
});

// Kết nối socket với JWT token
export const connectSocket = () => {
  if (!socket.connected) {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("Không tìm thấy access token. Vui lòng đăng nhập.");
      return;
    }
    socket.auth = { token };
    socket.connect();
  }
};

// Ngắt kết nối socket
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

// Kiểm tra trạng thái kết nối
export const isConnected = () => socket.connected;

// Event handlers cơ bản
socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

// DEBUG: Bắt tất cả events
socket.onAny((eventName, ...args) => {
  console.log(`📥 [Socket Event] ${eventName}:`, args);
});

socket.on("disconnect", () => {
  console.log("Socket disconnected");
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error.message);
  // Nếu lỗi do token, có thể thử refresh token
  if (error.message.includes("unauthorized") || error.message.includes("jwt")) {
    console.error("Token không hợp lệ. Vui lòng đăng nhập lại.");
    disconnectSocket();
  }
});

socket.on("error", (data) => {
  console.error("Socket error:", data.message);
});

export default socket;
