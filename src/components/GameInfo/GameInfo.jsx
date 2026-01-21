import React from 'react';
import './GameInfo.css';
const GameInfo = ({ roomData, userData, opponentData, isXNext, size, history }) => (
  <div className="right-side">
    <div className="room-header">
      <div className="room-title"><span>🏠 {roomData.name}</span><span className="waiting-timer">{roomData.waitingTime}</span></div>
      <div className="room-host">Chủ phòng: <strong>{roomData.host}</strong></div>
    </div>
    <div className={`user-profile ${isXNext ? 'active-turn' : ''}`}>
      <div className="turn-label">LƯỢT ĐI</div>
      <div className="profile-flex">
        <div className="avatar-box icon-x">X</div>
        <div className="user-stats">
          <div className="username">{userData.username}</div>
          <div className="elo-tag">🏆 ELO: {userData.elo}</div>
          <div className="stat-row"><span className="stat-win">W: {userData.wins}</span><span className="stat-loss">L: {userData.losses}</span><span className="stat-draw">D: {userData.draws}</span></div>
        </div>
      </div>
    </div>
    <div className="vs-divider">VS</div>
    <div className={`user-profile ${!isXNext ? 'active-turn' : ''}`}>
      <div className="turn-label">LƯỢT ĐI</div>
      <div className="profile-flex">
        <div className="avatar-box icon-o">O</div>
        <div className="user-stats">
          <div className="username">{opponentData.username}</div>
          <div className="elo-tag">🏆 ELO: {opponentData.elo}</div>
          <div className="stat-row"><span className="stat-win">W: {opponentData.wins}</span><span className="stat-loss">L: {opponentData.losses}</span><span className="stat-draw">D: {opponentData.draws}</span></div>
        </div>
      </div>
    </div>
    <div className="status-box">Bàn cờ hiện tại: {size}x{size}</div>
    <div className="history"><div className="history-title">📜 LỊCH SỬ</div><div className="history-list">
      {history.map((move, i) => (
        <div key={i} className="history-item">
          <span>#{move.step}. <strong className={move.player === 'X' ? 'txt-x' : 'txt-o'}>{move.player}</strong></span>
          <span>[{move.row}, {move.col}]</span>
        </div>
      ))}
    </div></div>
  </div>
);
export default GameInfo;