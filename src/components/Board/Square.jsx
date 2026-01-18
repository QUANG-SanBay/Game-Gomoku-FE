import React from 'react';
import './Square.css';
const Square = ({ value, onClick }) => (
  <div className="square" onClick={onClick}>
    {value === 'X' && <span className="piece x-icon">X</span>}
    {value === 'O' && <span className="piece o-icon">O</span>}
  </div>
);
export default Square;