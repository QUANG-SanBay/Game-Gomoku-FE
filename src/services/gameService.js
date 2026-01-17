import socket from "../socket/socket";

// Gửi nước đi
export const makeMove = (roomId, row, col) => {
  socket.emit("make_move", {
    room_id: roomId,
    row,
    col,
  });
};

// Nhận nước đi
export const onMoveMade = (callback) => {
  socket.on("move_made", callback);
};

// Kết thúc game
export const onGameOver = (callback) => {
  socket.on("game_over", callback);
};
