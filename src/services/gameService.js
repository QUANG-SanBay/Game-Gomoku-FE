import socket from "../socket/socket";

// ===== ROOM SOCKET EVENTS =====

// Vào phòng qua Socket.IO
// Emit: join_room
// Data: { room_id }
export const joinRoomSocket = (roomId) => {
  socket.emit("join_room", { room_id: roomId });
};

// Rời phòng qua Socket.IO
// Emit: leave_room
// Data: { room_id }
export const leaveRoomSocket = (roomId) => {
  socket.emit("leave_room", { room_id: roomId });
};

// Lắng nghe khi vào phòng thành công (chính mình)
// Listen: room_joined
// Data: { message, room_id, board_size, player_symbol, elo }
// player_symbol: "X" cho host, "O" cho player_2
export const onRoomJoined = (callback) => {
  socket.on("room_joined", callback);
};

// Lắng nghe khi đối thủ vào phòng
// Listen: opponent_joined
// Data: { message, opponent: { id, full_name, elo }, board_size }
export const onOpponentJoined = (callback) => {
  socket.on("opponent_joined", callback);
};

// Lắng nghe khi đối thủ rời phòng
// Listen: player_left
// Data: { message }
export const onPlayerLeft = (callback) => {
  socket.on("player_left", callback);
};

// Lắng nghe khi phòng bị đóng (host rời)
// Listen: room_closed
// Data: { message }
export const onRoomClosed = (callback) => {
  socket.on("room_closed", callback);
};

// Lắng nghe khi game bắt đầu (đủ 2 người)
// Listen: game_started
// Data: { message, match_id, player_x: { id, full_name, elo }, player_o: {...}, current_turn, board_size }
export const onGameStarted = (callback) => {
  socket.on("game_started", callback);
};

// ===== GAME PLAY EVENTS =====

// Gửi nước đi
// Emit: make_move
// Data: { room_id, row, col }
export const makeMove = (roomId, row, col) => {
  socket.emit("make_move", {
    room_id: roomId,
    row,
    col,
  });
};

// Lắng nghe nước đi (của cả 2 người chơi)
// Listen: move_made
// Data: { row, col, player, current_turn, board }
// player: "X" hoặc "O" (người vừa đi)
// current_turn: "X" hoặc "O" (lượt tiếp theo)
// board: [[row, col, player], ...] tất cả nước đã đi
export const onMoveMade = (callback) => {
  socket.on("move_made", callback);
};

// Lắng nghe kết thúc game
// Listen: game_over
// Data: {
//   message: "Game Over" | "Game Over - Draw",
//   winner: { id, full_name, symbol } | null,
//   winning_line: [[row, col], ...] | undefined,
//   elo_changes: { player_x: { old_elo, new_elo, change }, player_o: {...} },
//   stats: { player_x: { wins, losses, draws }, player_o: {...} }
// }
export const onGameOver = (callback) => {
  socket.on("game_over", callback);
};

// ===== CLEANUP FUNCTIONS =====

// Xóa tất cả listeners
export const removeAllGameListeners = () => {
  socket.off("room_joined");
  socket.off("opponent_joined");
  socket.off("player_left");
  socket.off("room_closed");
  socket.off("game_started");
  socket.off("move_made");
  socket.off("game_over");
};

// Xóa listener riêng lẻ
export const offRoomJoined = () => socket.off("room_joined");
export const offOpponentJoined = () => socket.off("opponent_joined");
export const offPlayerLeft = () => socket.off("player_left");
export const offRoomClosed = () => socket.off("room_closed");
export const offGameStarted = () => socket.off("game_started");
export const offMoveMade = () => socket.off("move_made");
export const offGameOver = () => socket.off("game_over");
