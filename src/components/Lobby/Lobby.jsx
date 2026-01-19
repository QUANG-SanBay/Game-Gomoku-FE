import { useEffect, useState } from "react";
import {
  socket,
  connectSocket,
  disconnectSocket,
} from "../../socket/socket";
import "./Lobby.css";

export default function Lobby({ onStart, onBack }) {
  const [roomName, setRoomName] = useState("");
  const [password, setPassword] = useState("");
  const [rooms, setRooms] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    connectSocket();

    const handleConnect = () => {
      setConnected(true);
      socket.emit("getRooms");
    };

    socket.on("connect", handleConnect);
    socket.on("roomList", setRooms);
    socket.on("joinedRoom", onStart);
    socket.on("errorMsg", alert);

    return () => {
      socket.off();
      disconnectSocket();
    };
  }, [onStart]);

  const createRoom = (e) => {
    e.preventDefault();
    if (!roomName || !password) {
      alert("Vui lòng nhập đủ tên phòng và mật khẩu");
      return;
    }

    socket.emit("createRoom", { roomName, password });
    setRoomName("");
    setPassword("");
  };

  const joinRoom = (room) => {
    if (room.players >= 2) return;
    const pass = prompt(`Nhập mật khẩu phòng "${room.name}"`);
    if (!pass) return;

    socket.emit("joinRoom", { roomName: room.name, password: pass });
  };

  return (
    <div className="lobby-bg">
      <div className="lobby-card">
        <button className="back-btn" onClick={onBack}>⬅ Menu</button>

        <h1>🎮 Gomoku</h1>

        <p className={connected ? "online" : "offline"}>
          {connected ? "🟢 Đã kết nối" : "🔴 Mất kết nối"}
        </p>

        {/* CREATE ROOM */}
        <form onSubmit={createRoom} className="create-room vertical">
          <input
            placeholder="Tên phòng"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />

          <input
            type="password"
            placeholder="Mật khẩu phòng"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Tạo phòng</button>
        </form>

        <h3>Danh sách phòng</h3>
        <ul>
          {rooms.map((r, i) => (
            <li key={i}>
              {r.name} ({r.players}/2) 🔒
              <button
                disabled={r.players >= 2}
                onClick={() => joinRoom(r)}
              >
                Join
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
