import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getRoomList, joinRoom } from "../../api/roomService";
import "./RoomList.css";

function RoomList() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [password, setPassword] = useState("");
  const [joining, setJoining] = useState(false);
  const intervalRef = useRef(null);
  const fetchingRef = useRef(false);

  useEffect(() => {
    fetchRooms();
    // Không auto refresh nữa, user thủ công refresh nếu muốn
  }, []);

  const fetchRooms = async () => {
    if (fetchingRef.current) return; // Tránh gọi trùng lặp
    
    fetchingRef.current = true;
    try {
      const response = await getRoomList();
      setRooms(response.data);
      setError(null);
    } catch (err) {
      console.error("Fetch rooms error:", err);
      setError(err.response?.data?.detail || "Không thể lấy danh sách phòng");
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  };

  const handleJoinRoom = async (room) => {
    if (room.has_password) {
      setSelectedRoom(room);
      setShowPasswordModal(true);
    } else {
      await joinRoomWithPassword(room.room_id, null);
    }
  };

  const joinRoomWithPassword = async (roomId, password) => {
    setJoining(true);
    try {
      const data = { room_id: parseInt(roomId) };
      if (password && password.trim()) {
        data.password = password.trim();
      }
      
      console.log("Joining room with data:", data);
      const response = await joinRoom(data);
      console.log("Join room response:", response.data);
      
      // Chuyển đến phòng chờ thay vì trực tiếp vào game
      navigate(`/waiting-room?roomId=${roomId}`);
    } catch (err) {
      console.error("Join room error:", err);
      console.error("Error response:", err.response?.data);
      
      let errorMsg = "Đã xảy ra lỗi";
      
      if (err.response?.status === 404) {
        errorMsg = "Phòng không tồn tại hoặc đã bị xóa. Vui lòng tải lại danh sách!";
        // Tự động reload danh sách
        fetchRooms();
      } else if (err.response?.status === 400) {
        errorMsg = err.response?.data?.detail || "Phòng đã đầy hoặc bạn đã ở trong phòng khác";
      } else if (err.response?.status === 403) {
        errorMsg = "Mật khẩu không đúng";
      } else {
        errorMsg = err.response?.data?.detail || 
                   err.response?.data?.message ||
                   "Không thể vào phòng";
      }
      
      alert(errorMsg);
    } finally {
      setJoining(false);
      setShowPasswordModal(false);
      setPassword("");
    }
  };

  const handlePasswordSubmit = () => {
    if (selectedRoom && password.trim()) {
      joinRoomWithPassword(selectedRoom.room_id, password);
    } else {
      alert("Vui lòng nhập mật khẩu");
    }
  };

  return (
    <div className="room-list-container">
      <button onClick={() => navigate("/")} className="back-btn">
        ⬅ Menu
      </button>

      <div className="room-list-card">
        <div className="room-list-header">
          <h1>🏠 Danh Sách Phòng</h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={fetchRooms} className="btn-refresh" disabled={loading}>
              🔄 Làm mới
            </button>
            <button onClick={() => navigate("/lobby")} className="btn-create-room">
              ➕ Tạo Phòng
            </button>
          </div>
        </div>

        {loading && <div className="loading">Đang tải...</div>}
        {error && <div className="error">{error}</div>}

        {!loading && rooms.length === 0 && (
          <div className="no-rooms">
            <p>Chưa có phòng nào. Hãy tạo phòng mới!</p>
          </div>
        )}

        {!loading && rooms.length > 0 && (
          <div className="rooms-grid">
            {rooms.map((room) => (
              <div key={room.room_id} className="room-item">
                <div className="room-header">
                  <h3>{room.room_name}</h3>
                  {room.has_password && <span className="lock-icon">🔒</span>}
                </div>
                
                <div className="room-info">
                  <p><strong>Host:</strong> {room.host_name}</p>
                  <p><strong>Kích thước:</strong> {room.board_size}x{room.board_size}</p>
                  <p><strong>Người chơi:</strong> {room.current_players}/2</p>
                  <p className={`status ${room.status}`}>
                    <strong>Trạng thái:</strong> {room.status === "waiting" ? "Chờ" : "Đang chơi"}
                  </p>
                </div>

                <button 
                  onClick={() => handleJoinRoom(room)}
                  disabled={room.status !== "waiting" || joining}
                  className="btn-join"
                >
                  {room.status === "waiting" ? "Tham Gia" : "Đang chơi"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal nhập mật khẩu */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Nhập Mật Khẩu Phòng</h3>
            <p>{selectedRoom?.room_name}</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
              className="password-input"
              onKeyPress={(e) => e.key === "Enter" && handlePasswordSubmit()}
            />
            <div className="modal-actions">
              <button onClick={handlePasswordSubmit} disabled={joining} className="btn-submit">
                {joining ? "Đang vào..." : "Xác Nhận"}
              </button>
              <button 
                onClick={() => {
                  setShowPasswordModal(false);
                  setPassword("");
                  setSelectedRoom(null);
                }} 
                className="btn-cancel-modal"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomList;
