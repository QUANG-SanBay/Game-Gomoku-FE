import { useEffect, useState } from "react";
import { socket } from "../../socket/socket";
import "./Board.css";

const SIZE = 15;

export default function Board({ roomName, mySymbol }) {
  const [board, setBoard] = useState(
    Array.from({ length: SIZE }, () => Array(SIZE).fill(null))
  );
  const [turn, setTurn] = useState(null);

  // 🔄 Reset khi vào phòng mới
  useEffect(() => {
    if (!roomName) return;

    setBoard(
      Array.from({ length: SIZE }, () => Array(SIZE).fill(null))
    );
    setTurn(null);
  }, [roomName]);

  // 🔌 Lắng nghe dữ liệu từ server
  useEffect(() => {
    const onGameState = ({ board, turn }) => {
      setBoard(board);
      setTurn(turn);
    };

    const onMove = ({ x, y, symbol, nextTurn }) => {
      setBoard((prev) => {
        const copy = prev.map((r) => [...r]);
        copy[x][y] = symbol;
        return copy;
      });
      setTurn(nextTurn);
    };

    socket.on("gameState", onGameState);
    socket.on("move", onMove);

    return () => {
      socket.off("gameState", onGameState);
      socket.off("move", onMove);
    };
  }, []);

  // 🖱 Đánh cờ
  const handleClick = (x, y) => {
    if (!roomName) return;
    if (!mySymbol) return;
    if (board[x][y]) return;
    if (turn !== mySymbol) return;

    socket.emit("move", {
      roomName,
      x,
      y,
    });
  };

  if (!roomName || !mySymbol) {
    return (
      <div className="board-bg">
        <h2>❌ Không có thông tin phòng</h2>
      </div>
    );
  }

  return (
    <div className="board-bg">
      <div className="board-container">
        <h3>
          Phòng: {roomName} | Bạn: {mySymbol} | Lượt: {turn ?? "..."}
        </h3>

        <div className="board">
          {board.map((row, x) =>
            row.map((cell, y) => (
              <div
                key={`${x}-${y}`}
                className={`cell ${cell ? "filled" : ""}`}
                onClick={() => handleClick(x, y)}
              >
                {cell}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
