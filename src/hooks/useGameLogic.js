import { useState, useCallback } from 'react';
import { checkWinner } from '../utils/checkWinner';

export const useGameLogic = (initialSize = 15) => {
  const [size, setSize] = useState(initialSize);
  const [board, setBoard] = useState(Array(initialSize * initialSize).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [history, setHistory] = useState([]);
  const [myRole, setMyRole] = useState(null); 

  const makeMove = useCallback((index, player) => {
    // 1. Kiểm tra xem ô này đã có trong Board chưa (tránh ghi đè dữ liệu cũ)
    if (board[index] || winner) return;

    // 2. Cập nhật Board
    const newBoard = [...board];
    newBoard[index] = player;
    setBoard(newBoard);

    // 3. Tính tọa độ
    const row = Math.floor(index / size) + 1;
    const col = (index % size) + 1;

    // 4. CẬP NHẬT LỊCH SỬ (Sửa lỗi nhân đôi tại đây)
    setHistory((prevHistory) => {
      // Kiểm tra nếu nước đi cuối cùng có cùng tọa độ thì không thêm nữa
      const lastMove = prevHistory[prevHistory.length - 1];
      if (lastMove && lastMove.row === row && lastMove.col === col) {
        return prevHistory; 
      }
      
      return [...prevHistory, {
        step: prevHistory.length + 1,
        player: player,
        row: row,
        col: col
      }];
    });

    // 5. Kiểm tra thắng thua
    const win = checkWinner(newBoard, index, size);
    if (win) {
      setWinner(win);
    } else {
      setIsXNext(player === 'X' ? false : true);
    }
  }, [board, size, winner]); // Thêm board vào dependency

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const currentPlayer = isXNext ? 'X' : 'O';
    
    // Nếu chơi offline (chưa có socket)
    if (!window.socketConnected) {
      makeMove(index, currentPlayer);
    } else {
      // Nếu có socket thì gửi đi (BE sẽ lo việc gọi ngược lại hàm makeMove)
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

  return { board, size, isXNext, winner, history, handleClick, resetGame, makeMove, setMyRole };
};