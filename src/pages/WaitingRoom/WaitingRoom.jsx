import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { leaveRoom } from "../../api/roomService";
import { socket, connectSocket, disconnectSocket } from "../../socket/socket";
import "./WaitingRoom.css";

function WaitingRoom() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId");
  
  const [roomInfo, setRoomInfo] = useState({
    room_name: "Đang tải...",
    host_name: "",
    board_size: 15,
    current_players: 1
  });
  const [waiting, setWaiting] = useState(true);
  const [mySymbol, setMySymbol] = useState(null);

  useEffect(() => {
    if (!roomId) {
      alert("Không tìm thấy phòng");
      navigate("/rooms");
      return;
    }

    // Kết nối socket
    connectSocket();

    // Lắng nghe các events (dọn listener cũ trước khi đăng ký)
    socket.off("joined_room");
    socket.off("player_joined");
    socket.off("game_start");
    socket.off("error");

    socket.once("joined_room", (data) => {
      console.log("✅ joined_room:", data);
      setMySymbol(data.player_symbol);
      setRoomInfo(prev => ({
        ...prev,
        board_size: data.board_size
      }));
    });

    socket.once("player_joined", (data) => {
      console.log("👤 player_joined:", data);
      setRoomInfo(prev => ({ ...prev, current_players: data.player_count || 2 }));
      setWaiting(false);
    });

    socket.once("game_start", (data) => {
      console.log("🎮 game_start:", data);
      navigate(`/game?roomId=${roomId}`);
    });

    socket.on("error", (data) => {
      console.error("❌ Socket error:", data);
      const msg = data.error || data.message || "Có lỗi xảy ra";
      alert(msg);
      if (msg.includes("Phòng không tồn tại") || msg.includes("room")) {
        disconnectSocket();
        navigate("/rooms");
      }
    });

    // Join room qua socket
    socket.emit("join_room", { room_id: parseInt(roomId) });

    return () => {
      socket.off("joined_room");
      socket.off("player_joined");
      socket.off("game_start");
      socket.off("error");
    };
  }, [roomId, navigate]);

  const handleLeaveRoom = async () => {
    if (!confirm("Bạn có chắc muốn rời phòng? Phòng sẽ bị xóa.")) {
      return;
    }

    try {
      socket.emit("leave_room", { room_id: parseInt(roomId) });
      disconnectSocket();
      navigate("/rooms");
    } catch (err) {
      console.error("Leave room error:", err);
      alert("Không thể rời phòng");
    }
  };

  return (
    <div className="waiting-room-container">
      <div className="waiting-room-card">
        <h1>🏠 Phòng Chờ</h1>
        
        <div className="room-details">
          <div className="detail-item">
            <span className="label">Tên phòng:</span>
            <span className="value">{roomInfo.room_name}</span>
          </div>
          <div className="detail-item">
            <span className="label">Host:</span>
            <span className="value">{roomInfo.host_name}</span>
          </div>
          <div className="detail-item">
            <span className="label">Kích thước:</span>
            <span className="value">{roomInfo.board_size}x{roomInfo.board_size}</span>
          </div>
          <div className="detail-item">
            <span className="label">Người chơi:</span>
            <span className="value">{roomInfo.current_players}/2</span>
          </div>
        </div>

        {waiting ? (
          <div className="waiting-status">
            <div className="spinner"></div>
            <p>Đang chờ người chơi thứ 2...</p>
            <small>Phòng ID: {roomId} | Bạn là: {mySymbol || '...'}</small>
          </div>
        ) : (
          <div className="ready-status">
            <div className="check-icon">✓</div>
            <p>Đã đủ người! Đang bắt đầu trận đấu...</p>
          </div>
        )}

        <button onClick={handleLeaveRoom} className="btn-leave">
          ❌ Rời Phòng
        </button>
      </div>
    </div>
  );
}

export default WaitingRoom;
