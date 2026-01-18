import { io } from "socket.io-client";

// Địa chỉ backend socket
const SOCKET_URL = "http://localhost:3000";

// export socket để dùng khắp app
export const socket = io(SOCKET_URL, {
  autoConnect: false, // ❗ không connect ngay để tránh crash
  transports: ["websocket"],
});
