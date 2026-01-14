import React from 'react';
import './GameInfo.css';

const GameInfo = ({ roomData, userData, opponentData, isXNext, size, history }) => {
  return (
    <div className="right-side">
      {/* HEADER PHÒNG */}
      <div className="room-header">
        <div className="room-title">
          <span>🏠 {roomData.name}</span>
          <span className="waiting-timer">{roomData.waitingTime}</span>
        </div>
        <div className="room-host">Chủ phòng: <strong>{roomData.host}</strong></div>
      </div>

      {/* PLAYER 1 */}
      <div className={`user-profile ${isXNext ? 'active-turn' : ''}`}>
        <div className="turn-label">LƯỢT ĐI</div>
        <div className="profile-flex">
          <div className="avatar-box">⚪</div>
          <div className="user-stats">
            <div className="username">{userData.username}</div>
            <div className="elo-tag">🏆 ELO: {userData.elo}</div>
            <div className="stat-row">
              <span className="stat-win">W: {userData.wins}</span>
              <span className="stat-loss">L: {userData.losses}</span>
              <span className="stat-draw">D: {userData.draws}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="vs-divider">VS</div>

      {/* PLAYER 2 */}
      <div className={`user-profile ${!isXNext ? 'active-turn' : ''}`}>
        <div className="turn-label">LƯỢT ĐI</div>
        <div className="profile-flex">
          <div className="avatar-box">⚫</div>
          <div className="user-stats">
            <div className="username">{opponentData.username}</div>
            <div className="elo-tag">🏆 ELO: {opponentData.elo}</div>
            <div className="stat-row">
              <span className="stat-win">W: {opponentData.wins}</span>
              <span className="stat-loss">L: {opponentData.losses}</span>
              <span className="stat-draw">D: {opponentData.draws}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="status-box">
        Bàn cờ hiện tại: {size}x{size}
      </div>

      {/* LỊCH SỬ */}
      <div className="history">
        <div className="history-title">📜 LỊCH SỬ NƯỚC CỜ</div>
        <div className="history-list">
          {history.length === 0 ? (
            <div style={{textAlign:'center', color:'#aaa', marginTop:'20px', fontSize:'12px'}}>Chưa có nước đi</div>
          ) : (
            history.map((move, index) => (
              <div key={index} className="history-item">
                <span>#{move.step}. <strong>{move.player === 'X' ? 'Trắng' : 'Đen'}</strong></span>
                <span>[{move.row}, {move.col}]</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GameInfo;