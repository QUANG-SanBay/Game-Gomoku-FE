import { useState, useCallback } from 'react';
import { checkWinner } from '../utils/checkWinner';

export const useGameLogic = (initialSize = 15) => {
  const [size, setSize] = useState(initialSize);
  const [board, setBoard] = useState(Array(initialSize * initialSize).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [history, setHistory] = useState([]);

  // --- 1. ĐIỂM MỚI: QUẢN LÝ VAI TRÒ (Dành cho Socket) ---
  // Mặc định là null (chơi 2 người trên 1 máy). 
  // Khi có Socket, BE sẽ set ví dụ: 'X' (bạn cầm quân Trắng)
  const [myRole, setMyRole] = useState(null); 

  // --- 2. HÀM CẬP NHẬT TỪ SERVER (Dành cho Socket) ---
  // Người làm Socket sẽ gọi hàm này khi nhận được tin nhắn từ Django
  const makeMove = useCallback((index, playerFromSocket) => {
    setBoard((prevBoard) => {
      if (prevBoard[index] || winner) return prevBoard;

      const newBoard = [...prevBoard];
      newBoard[index] = playerFromSocket;

      // Cập nhật lịch sử
      const row = Math.floor(index / size) + 1;
      const col = (index % size) + 1;
      setHistory((prev) => [...prev, {
        step: prev.length + 1,
        player: playerFromSocket,
        row, col
      }]);

      // Kiểm tra thắng thua ngay khi nhận dữ liệu
      const win = checkWinner(newBoard, index, size);
      if (win) setWinner(win);

      return newBoard;
    });

    setIsXNext(playerFromSocket === 'X' ? false : true);
  }, [size, winner]);

  // --- 3. HÀM CLICK CỦA NGƯỜI CHƠI ---
  const handleClick = (index) => {
    if (board[index] || winner) return;

    // Logic Socket: Kiểm tra xem có đúng lượt của mình không
    const currentPlayer = isXNext ? 'X' : 'O';
    if (myRole && currentPlayer !== myRole) {
      console.log("Chưa đến lượt của bạn!");
      return;
    }

    // NẾU CHƯA CÓ SOCKET: Chạy offline như cũ
    if (!window.socketConnected) { 
      makeMove(index, currentPlayer);
    } else {
      // NẾU CÓ SOCKET: Gửi lệnh lên Server (Người làm BE sẽ viết ở đây)
      // window.sendSocketMove(index, currentPlayer);
    }
  };

  const resetGame = (newSize) => {
    const s = newSize || size;
    setSize(s);
    setBoard(Array(s * s).fill(null));
    setIsXNext(true);
    setWinner(null);
    setHistory([]);
  };

  return { 
    board, size, isXNext, winner, history, 
    handleClick, resetGame, makeMove, setMyRole 
  };
};