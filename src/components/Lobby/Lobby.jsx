import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom, leaveRoom } from "../../api/roomService";
import "./Lobby2.css";

export default function Lobby() {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("");
  const [password, setPassword] = useState("");
  const [boardSize, setBoardSize] = useState(15);
  const [creating, setCreating] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [pendingRoomData, setPendingRoomData] = useState(null);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    
    if (!roomName.trim()) {
      alert("Vui lòng nhập tên phòng");
      return;
    }

    if (roomName.trim().length < 3) {
      alert("Tên phòng phải có ít nhất 3 ký tự");
      return;
    }

    const data = {
      room_name: roomName.trim(),
      board_size: boardSize
    };
    
    if (password.trim()) {
      data.password = password.trim();
    }

    await attemptCreateRoom(data);
  };

  const attemptCreateRoom = async (data) => {
    setCreating(true);
    try {
      console.log("Creating room with data:", data);
      const response = await createRoom(data);
      console.log("Create room response:", response.data);
      
      navigate(`/waiting-room?roomId=${response.data.room_id}`);
    } catch (err) {
      console.error("Create room error:", err);
      console.error("Error response:", err.response?.data);
      
      if (err.response?.status === 400) {
        const errorDetail = err.response?.data?.detail || "";
        
        if (errorDetail.includes("đã có phòng") || errorDetail.includes("already has a room")) {
          setPendingRoomData(data);
          setShowLeaveModal(true);
        } else {
          alert(errorDetail || "Bạn đã có phòng hoặc xảy ra lỗi");
        }
      } else if (err.response?.status === 401) {
        alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        navigate("/login");
      } else {
        const errorMsg = err.response?.data?.detail || 
                         err.response?.data?.message ||
                         "Không thể tạo phòng";
        alert(errorMsg);
      }
    } finally {
      setCreating(false);
    }
  };

  const handleLeaveAndCreate = async () => {
    setCreating(true);
    try {
      console.log("Leaving old room...");
      // Gọi API leave không cần room_id (backend tự detect phòng của user)
      const leaveResponse = await leaveRoom({});
      console.log("Leave response:", leaveResponse.data);
      
      // Không hiện alert, trực tiếp tạo phòng mới
      setShowLeaveModal(false);
      
      // Tạo phòng mới ngay lập tức
      await attemptCreateRoom(pendingRoomData);
    } catch (err) {
      console.error("Leave room error:", err);
      console.error("Leave room error response:", err.response);
      
      // Nếu lỗi 404, có thể phòng đã không tồn tại, thử tạo phòng mới luôn
      if (err.response?.status === 404) {
        console.log("Không tìm thấy phòng cũ, tạo phòng mới...");
        setShowLeaveModal(false);
        await attemptCreateRoom(pendingRoomData);
      } else {
        alert(err.response?.data?.detail || "Không thể rời phòng cũ");
        setShowLeaveModal(false);
      }
    } finally {
      setCreating(false);
      setPendingRoomData(null);
    }
  };

  return (
    <div className="lobby-bg">
      <div className="lobby-card">
        <button className="back-btn" onClick={() => navigate("/rooms")}>
          ⬅ Danh sách phòng
        </button>

        <h1>➕ Tạo Phòng Mới</h1>
        <p className="subtitle">Thiết lập phòng chơi của bạn</p>

        <form onSubmit={handleCreateRoom} className="create-room-form">
          <div className="form-group">
            <label>Tên Phòng <span className="required">*</span></label>
            <input
              type="text"
              placeholder="VD: Phòng của tôi"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="input-field"
              maxLength={50}
              required
            />
          </div>

          <div className="form-group">
            <label>Mật Khẩu <span className="optional">(Tùy chọn)</span></label>
            <input
              type="password"
              placeholder="Để trống nếu không cần"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              maxLength={20}
            />
          </div>

          <div className="form-group">
            <label>Kích Thước Bàn Cờ</label>
            <div className="board-size-selector">
              <button
                type="button"
                className={boardSize === 15 ? "active" : ""}
                onClick={() => setBoardSize(15)}
              >
                15x15
              </button>
              <button
                type="button"
                className={boardSize === 19 ? "active" : ""}
                onClick={() => setBoardSize(19)}
              >
                19x19
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={creating}
            className="btn-create"
          >
            {creating ? "Đang tạo..." : "🎮 Tạo Phòng"}
          </button>
        </form>
      </div>

      {/* Modal xác nhận rời phòng cũ */}
      {showLeaveModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>⚠️ Phòng Đã Tồn Tại</h3>
            <p>Bạn đã có phòng trước đó. Bạn có muốn rời phòng cũ và tạo phòng mới không?</p>
            <div className="modal-actions">
              <button 
                onClick={handleLeaveAndCreate} 
                disabled={creating}
                className="btn-submit"
              >
                {creating ? "Đang xử lý..." : "✓ Rời và Tạo Mới"}
              </button>
              <button 
                onClick={() => {
                  setShowLeaveModal(false);
                  setPendingRoomData(null);
                }} 
                className="btn-cancel-modal"
                disabled={creating}
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
