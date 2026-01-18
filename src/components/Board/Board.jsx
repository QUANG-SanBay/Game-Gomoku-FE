import { useEffect, useState } from "react";
import { socket } from "../../socket/socket";
import "./Board.css";

const SIZE = 15;

export default function Board({ roomName, mySymbol }) {
  const [board, setBoard] = useState(
    Array.from({ length: SIZE }, () => Array(SIZE).fill(null))
  );
  const [turn, setTurn] = useState("X");

  useEffect(() => {
    socket.on("move", ({ x, y, symbol }) => {
      setBoard((prev) => {
        const copy = prev.map((r) => [...r]);
        copy[x][y] = symbol;
        return copy;
      });
      setTurn(symbol === "X" ? "O" : "X");
    });

    return () => socket.off();
  }, []);

  return (
    <div className="board-bg">
      <div className="board-container">
        <h3>
          Phòng: {roomName} | Bạn: {mySymbol} | Lượt: {turn}
        </h3>

        <div className="board">
          {board.map((row, x) =>
            row.map((cell, y) => (
              <div key={`${x}-${y}`} className="cell">
                {cell}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
