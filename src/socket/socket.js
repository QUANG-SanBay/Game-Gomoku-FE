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
