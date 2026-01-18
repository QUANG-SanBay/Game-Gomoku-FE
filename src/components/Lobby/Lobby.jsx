import { useEffect, useState } from "react";
import { socket } from "../../socket/socket";
import "./Lobby.css";

export default function Lobby({ onStartGame }) {
  const [roomName, setRoomName] = useState("");
  const [rooms, setRooms] = useState([]);
  const [connected] = useState(true);


  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("getRooms");
    });

    socket.on("roomList", setRooms);
    socket.on("joinedRoom", ({ roomName, symbol }) =>
      onStartGame(roomName, symbol)
    );

    return () => socket.off();
  }, [onStartGame]);

  const createRoom = (e) => {
    e.preventDefault();
    if (!roomName) return;
    socket.emit("createRoom", { roomName });
    setRoomName("");
  };

  return (
    <div className="lobby-bg">
      <div className="lobby-card">
        <h1>🎮 Gomoku</h1>

        <p className={connected ? "online" : "offline"}>
          {connected ? "🟢 Đã kết nối" : "🔴 Mất kết nối"}
        </p>

        <form onSubmit={createRoom} className="create-room">
          <input
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Tên phòng"
          />
          <button>Tạo phòng</button>
        </form>

        <h3>Danh sách phòng</h3>
        <ul>
          {rooms.map((r, i) => (
            <li key={i}>
              {r.name} ({r.players}/2)
              <button
                disabled={r.players >= 2}
                onClick={() => socket.emit("joinRoom", { roomName: r.name })}
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
