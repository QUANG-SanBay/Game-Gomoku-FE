import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3000";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket"],
});

// ✅ Helper an toàn
export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

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
