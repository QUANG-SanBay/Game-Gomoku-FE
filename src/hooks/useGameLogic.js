import { useState, useCallback } from 'react';
import { checkWinner } from '../utils/checkWinner';

export const useGameLogic = (initialSize = 15) => {
  const [size, setSize] = useState(initialSize);
  const [board, setBoard] = useState(Array(initialSize * initialSize).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [history, setHistory] = useState([]);
  const [myRole, setMyRole] = useState('X'); // BE gọi setMyRole khi join phòng

  const makeMove = useCallback((index, player) => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = player;
    setBoard(newBoard);

    const row = Math.floor(index / size) + 1;
    const col = (index % size) + 1;
    setHistory(prev => {
      const last = prev[prev.length - 1];
      if (last && last.row === row && last.col === col) return prev;
      return [...prev, { step: prev.length + 1, player, row, col }];
    });

    const win = checkWinner(newBoard, index, size);
    if (win) setWinner(win);
    else setIsXNext(player === 'X' ? false : true);
  }, [board, size, winner]);

  const handleClick = (index) => {
    if (board[index] || winner) return;
    const currentPlayer = isXNext ? 'X' : 'O';
    if (myRole && currentPlayer !== myRole) return; // Chặn đánh thay đối thủ

    if (!window.socketConnected) makeMove(index, currentPlayer);
    else window.sendSocketMove?.(index, currentPlayer); // Điểm nối Socket
  };

  const resetGame = (newSize) => {
    const s = newSize || size;
    setSize(s); setBoard(Array(s * s).fill(null));
    setIsXNext(true); setWinner(null); setHistory([]);
  };

  return { board, size, isXNext, winner, history, handleClick, resetGame, makeMove, myRole, setMyRole };
};