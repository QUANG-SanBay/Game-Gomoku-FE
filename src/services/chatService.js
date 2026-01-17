import socket from "../socket/socket";

// gửi tin nhắn
export const sendChatMessage = (roomId, message) => {
  socket.emit("send_message", {
    room_id: roomId,
    message,
  });
};

// nhận tin nhắn
export const onReceiveChatMessage = (callback) => {
  socket.on("receive_message", callback);
};
