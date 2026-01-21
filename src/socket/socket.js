import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:8000";

// Lấy token từ localStorage
const getToken = () => {
  const token = localStorage.getItem("access_token");
  console.log("🔑 Getting token:", token ? `${token.substring(0, 20)}...` : "NO TOKEN");
  return token;
};

// Tạo socket instance mới với auth
let socket = null;

const createSocket = () => {
  const token = getToken();
  if (!token) {
    console.error("❌ No token available, cannot create socket");
    return null;
  }

  // Reuse existing live socket to avoid dropping rooms unintentionally
  if (socket && (socket.connected || socket.connecting)) {
    socket.auth = { token };
    return socket;
  }

  console.log("🔌 Creating new socket with token");

  socket = io(SOCKET_URL, {
    autoConnect: false,
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 3,
    reconnectionDelay: 500,
    reconnectionDelayMax: 2000,
    auth: {
      token: token
    }
  });
  
  // Event handlers cơ bản
  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("reconnect_attempt", (attempt) => {
    console.log("Socket reconnecting... attempt", attempt);
  });

  socket.on("reconnect", (attempt) => {
    console.log("Socket reconnected after", attempt, "tries");
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
    console.error("Socket error:", data.message || data);
  });
  
  return socket;
};

// KHÔNG khởi tạo socket lúc module load
// socket = createSocket();

export { socket };

// ✅ Helper an toàn
export const connectSocket = () => {
  console.log("🔌 connectSocket called");
  // Chỉ tạo mới khi chưa có kết nối; tránh disconnect phiên hiện tại
  socket = createSocket();

  if (!socket) {
    console.error("❌ Failed to create socket");
    return;
  }

  if (!socket.connected && !socket.connecting) {
    console.log("🚀 Connecting socket...");
    socket.connect();
  } else {
    console.log("✅ Socket already connected or connecting");
  }
};

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
  }
};

// Kiểm tra trạng thái kết nối
export const isConnected = () => socket && socket.connected;

export default socket;
