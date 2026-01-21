import socket from "../socket/socket";

// Gửi tin nhắn chat trong phòng
// Emit: send_message
// Data: { room_id, message }
export const sendChatMessage = (roomId, message) => {
  socket.emit("send_message", {
    room_id: roomId,
    message,
  });
};

// Lắng nghe tin nhắn mới
// Listen: receive_message (theo spec backend)
// Data: { player: { id, full_name }, message, timestamp }
export const onReceiveMessage = (callback) => {
  socket.on("receive_message", callback);
};

// Xóa listener tin nhắn
export const offReceiveMessage = () => {
  socket.off("receive_message");
};
