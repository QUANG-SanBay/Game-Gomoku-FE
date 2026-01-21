import React, { useState } from 'react';
import './BoardContainer.css';
import BoardGrid from '../components/Board/Board';
import GameInfo from '../components/GameInfo/GameInfo';
import { useGameLogic } from '../hooks/useGameLogic';

function BoardContainer({ initialSize = 15 }) {
  // Lấy tất cả từ Hook, kể cả myRole
  const { board, size, isXNext, winner, history, handleClick, resetGame, myRole } = useGameLogic(initialSize);

  const [room] = useState({ name: "Bàn #116", host: "pst4927g", waitingTime: "02:45" });
  const [user] = useState({ username: "Bạn (X)", elo: 1250, wins: 45, losses: 12, draws: 8 });
  const [opponent] = useState({ username: "Đối thủ (O)", elo: 1180, wins: 30, losses: 15, draws: 5 });
  const [rematchStatus, setRematchStatus] = useState('none');

  const handleInvite = () => setRematchStatus('sent');
  const handleAccept = () => {
    resetGame();
    setRematchStatus('none');
  };

  return (
    <div className="game-container">
      <div className="left-side">
        <BoardGrid board={board} size={size} onSquareClick={handleClick} />
        
        {winner && (
          <div className="win-modal-overlay">
            <div className="win-modal-content">
              {/* Nếu chưa set myRole (đang test) thì hiện theo quân thắng */}
              {winner === myRole || myRole === null ? (
                <h2 className="winner-text">QUÂN {winner} THẮNG! 🏆</h2>
              ) : (
                <h2 className="loser-text">BẠN ĐÃ THUA... 💀</h2>
              )}
              
              <p>Trận đấu đã kết thúc</p>

              <div className="rematch-btns">
                <button className="btn-play-again" onClick={handleInvite}>Chơi lại</button>
                <button className="btn-exit" onClick={() => alert("Thoát")}>Thoát</button>
              </div>

              {rematchStatus === 'received' && (
                <div className="rematch-invite">
                  <p>Đối thủ mời tái đấu!</p>
                  <button className="btn-accept" onClick={handleAccept}>Chấp nhận</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <GameInfo 
        roomData={room} userData={user} opponentData={opponent}
        isXNext={isXNext} size={size} history={history}
      />
    </div>
  );
}

export default BoardContainer;