import { useEffect, useState } from "react";
import { getLeaderboard } from "../api/userService";
import "./Leaderboard.css";

export default function Leaderboard({ onBack, onViewProfile }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await getLeaderboard();
        setPlayers(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Không thể tải bảng xếp hạng");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="leaderboard-bg">
      <div className="leaderboard-card">
        <button className="back-btn" onClick={onBack}>
          ⬅ Menu
        </button>

        <h1>🏆 Bảng xếp hạng</h1>

        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Người chơi</th>
                <th>Elo</th>
                <th>Thắng</th>
                <th>Thua</th>
                <th>Hòa</th>
              </tr>
            </thead>

            <tbody>
              {players.map((p, i) => (
                <tr 
                  key={i}
                  onClick={() => onViewProfile?.(p.id)}
                  style={{ cursor: onViewProfile ? "pointer" : "default" }}
                >
                  <td>{i + 1}</td>
                  <td>{p.username || p.full_name}</td>
                  <td>{p.elo}</td>
                  <td>{p.wins}</td>
                  <td>{p.losses || 0}</td>
                  <td>{p.draws || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
