export const checkWinner = (board, index, size) => {
  const row = Math.floor(index / size);
  const col = index % size;
  const player = board[index];

  const directions = [
    { x: 0, y: 1 },  // Ngang
    { x: 1, y: 0 },  // Dọc
    { x: 1, y: 1 },  // Chéo xuôi
    { x: 1, y: -1 }, // Chéo ngược
  ];

  for (let { x, y } of directions) {
    let count = 1;

    // Kiểm tra hướng tiến
    let r = row + x;
    let c = col + y;
    while (r >= 0 && r < size && c >= 0 && c < size && board[r * size + c] === player) {
      count++;
      r += x;
      c += y;
    }

    // Kiểm tra hướng lùi
    r = row - x;
    c = col - y;
    while (r >= 0 && r < size && c >= 0 && c < size && board[r * size + c] === player) {
      count++;
      r -= x;
      c -= y;
    }

    if (count >= 5) return player;
  }
  return null;
};