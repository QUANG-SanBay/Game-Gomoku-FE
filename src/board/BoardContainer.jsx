import React from 'react';
import './BoardContainer.css'; // Sẽ đổi tên App.css thành file này
import BoardGrid from '../components/Board/Board'; // Lùi 1 cấp vào components
import GameInfo from '../components/GameInfo/GameInfo'; // Lùi 1 cấp vào components
import { useGameLogic } from '../hooks/useGameLogic'; // Lùi 1 cấp vào hooks

function BoardContainer({ 
  initialSize = 15, 
  roomData = { name: "Phòng của pst4927g", host: "pst4927g", waitingTime: "02:45" },
  userData = { username: "wds5626g", elo: 1250, wins: 45, losses: 12, draws: 8 },
  opponentData = { username: "pst4927g", elo: 1180, wins: 30, losses: 15, draws: 5 }
}) {
  const { board, size, isXNext, winner, history, handleClick, resetGame } = useGameLogic(initialSize);

  return (
    <div className="game-container">
      {/* BÊN TRÁI: BÀN CỜ */}
      <div className="left-side">
        <BoardGrid board={board} size={size} onSquareClick={handleClick} />
        
        {winner && (
          <div className="win-modal-overlay">
            <div className="win-modal-content">
              <h2>{winner === 'X' ? '⚪ TRẮNG' : '⚫ ĐEN'} THẮNG!</h2>
              <button className="btn-play-again" onClick={() => resetGame()}>Chơi lại</button>
            </div>
          </div>
        )}
      </div>

      {/* BÊN PHẢI: THÔNG TIN */}
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

export default BoardContainer;