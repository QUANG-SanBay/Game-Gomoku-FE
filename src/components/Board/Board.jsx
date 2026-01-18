import React from 'react';
import './Board.css';
import Square from './Square';
const Board = ({ board, size, onSquareClick }) => (
  <div className="board-wrapper">
    <div className="board" style={{ 
      display: 'grid', gridTemplateColumns: `repeat(${size}, 1fr)`, 
      gridTemplateRows: `repeat(${size}, 1fr)`, width: '100%', 
      maxWidth: size === 15 ? '600px' : '720px', aspectRatio: '1/1' 
    }}>
      {board.map((val, i) => <Square key={i} value={val} onClick={() => onSquareClick(i)} />)}
    </div>
  </div>
);
export default Board;