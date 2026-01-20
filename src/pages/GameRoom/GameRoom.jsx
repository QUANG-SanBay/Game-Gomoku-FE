import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameBoardWithSocket from './GameBoardWithSocket';
import { createRoom, joinRoom, getRoomList } from '../../api/roomService';
import './GameRoom.css';

function GameRoom() {
  const navigate = useNavigate();
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [currentRoomInfo, setCurrentRoomInfo] = useState(null);
  const [showRoomDialog, setShowRoomDialog] = useState(true);
  const [roomName, setRoomName] = useState('');
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      alert('Vui lòng nhập tên phòng');
      return;
    }

    setLoading(true);
    try {
      const response = await createRoom({ room_name: roomName });
      setCurrentRoomId(response.data.room_id);
      setCurrentRoomInfo({ room_name: response.data.room_name });
      setShowRoomDialog(false);
      console.log('Created room:', response.data);
    } catch (err) {
      alert(err.response?.data?.detail || 'Không thể tạo phòng');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (roomId) => {
    setLoading(true);
    try {
      const response = await joinRoom(roomId);
      setCurrentRoomId(roomId);
      setCurrentRoomInfo(response.data);
      setShowRoomDialog(false);
      console.log('Joined room:', response.data);
    } catch (err) {
      alert(err.response?.data?.detail || 'Không thể vào phòng');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadRooms = async () => {
    setLoading(true);
    try {
      const response = await getRoomList();
      setAvailableRooms(response.data);
    } catch (err) {
      alert('Không thể tải danh sách phòng');
    } finally {
      setLoading(false);
    }
  };

  if (showRoomDialog) {
    return (
      <div className="room-dialog-overlay">
        <div className="room-dialog">
          <h2>Chọn hoặc Tạo Phòng</h2>

          <div className="room-section">
            <h3>Tạo Phòng Mới</h3>
            <input
              type="text"
              placeholder="Tên phòng..."
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="room-input"
            />
            <button
              onClick={handleCreateRoom}
              disabled={loading}
              className="btn-primary"
            >
              Tạo Phòng
            </button>
          </div>

          <div className="room-section">
            <h3>Danh Sách Phòng</h3>
            <button onClick={handleLoadRooms} disabled={loading} className="btn-secondary">
              Tải Danh Sách
            </button>

            {availableRooms.length > 0 && (
              <div className="room-list">
                {availableRooms.map((room) => (
                  <div key={room.room_id} className="room-item">
                    <div className="room-info">
                      <strong>{room.room_name}</strong>
                      <span>Host: {room.host_name}</span>
                      <span>Người chơi: {room.current_players}/2</span>
                    </div>
                    <button
                      onClick={() => handleJoinRoom(room.room_id)}
                      disabled={loading}
                      className="btn-join"
                    >
                      Vào
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button onClick={() => navigate('/')} className="btn-back">
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-room">
      <GameBoardWithSocket roomId={currentRoomId} roomInfo={currentRoomInfo} />
    </div>
  );
}

export default GameRoom;
