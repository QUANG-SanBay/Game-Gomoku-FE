import React from 'react';
import './Board.css';
import Square from './Square';

const Board = ({ board, size, onSquareClick }) => {
  return (
    <div 
      className="board" 
      style={{ 
        display: 'grid',
        // Tạo số cột dựa trên size
        gridTemplateColumns: `repeat(${size}, 1fr)`, 
        
        // --- PHẦN QUAN TRỌNG ĐỂ RESPONSIVE ---
        width: '100%',             // Luôn chiếm hết chiều rộng của vùng chứa (nhưng bị giới hạn bởi maxWidth)
        maxWidth: size === 15 ? '600px' : '720px', // Chiều cao tối đa trên máy tính
        aspectRatio: '1 / 1',      // Giữ bàn cờ luôn là hình vuông hoàn hảo
        // ------------------------------------
      }}
    >
      {board.map((val, i) => (
        <Square key={i} value={val} onClick={() => onSquareClick(i)} />
      ))}
    </div>
  );
};

export default Board;