import React from 'react';
import './App.css';
import Board from './components/Board/Board';
import GameInfo from './components/GameInfo/GameInfo';
import { useGameLogic } from './hooks/useGameLogic';

function App({ 
  initialSize = 15, 
  roomData = { name: "Phòng của pst4927g", host: "pst4927g", waitingTime: "02:45" },
  userData = { username: "wds5626g", elo: 1250, wins: 45, losses: 12, draws: 8 },
  opponentData = { username: "pst4927g", elo: 1180, wins: 30, losses: 15, draws: 5 }
}) {
  const { board, size, isXNext, winner, history, handleClick, resetGame } = useGameLogic(initialSize);

  return (
    <div className="game-container">
      <div className="left-side">
        <Board board={board} size={size} onSquareClick={handleClick} />
        
        {winner && (
          <div className="win-modal-overlay">
            <div className="win-modal-content">
              <h2>{winner === 'X' ? '⚪ TRẮNG' : '⚫ ĐEN'} THẮNG!</h2>
              <button className="btn-play-again" onClick={() => resetGame()}>Chơi lại</button>
            </div>
          </div>
        )}
      </div>

      <GameInfo 
        roomData={roomData}
        userData={userData}
        opponentData={opponentData}
        isXNext={isXNext}
        size={size}
        history={history}
      />
    </div>
  );
}

export default App;