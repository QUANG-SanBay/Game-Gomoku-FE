import React from 'react';
import './Square.css';

const Square = ({ value, onClick }) => {
  return (
    <div className="square" onClick={onClick}>
      {value === 'X' && <div className="stone white"></div>}
      {value === 'O' && <div className="stone black"></div>}
    </div>
  );
};
export default Square;