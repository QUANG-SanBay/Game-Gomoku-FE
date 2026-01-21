import React, { useState } from 'react';
import '../../board/BoardContainer.css';
import BoardGrid from '../../components/Board/Board';
import GameInfo from '../../components/GameInfo/GameInfo';
import { useGameLogic } from '../../hooks/useGameLogic';
import { useGameSocket } from '../../hooks/useGameSocket';

function GameBoardWithSocket({ roomId, roomInfo }) {
  const {
    board, size, isXNext, winner, history,
    handleClick, resetGame, makeMove, myRole, setMyRole
  } = useGameLogic(15);

  const { gameStarted } = useGameSocket(
    roomId,
    makeMove,
    setMyRole,
    resetGame
  );

  const [user] = useState({ username: "Bạn", elo: 1250, wins: 45, losses: 12, draws: 8 });
  const [opponent] = useState({ username: "Đối thủ", elo: 1180, wins: 30, losses: 15, draws: 5 });
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
        roomData={{
          name: roomInfo?.room_name || "Phòng",
          host: roomInfo?.host_name || "...",
          waitingTime: gameStarted ? "Đang chơi" : "Chờ đối thủ"
        }}
        userData={{
          ...user,
          username: `Bạn (${myRole})`
        }}
        opponentData={{
          ...opponent,
          username: `Đối thủ (${myRole === 'X' ? 'O' : 'X'})`
        }}
        isXNext={isXNext}
        size={size}
        history={history}
      />
    </div>
  );
}

export default GameBoardWithSocket;
