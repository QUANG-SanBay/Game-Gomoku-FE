import { useEffect, useState } from "react";
import { getCurrentUser } from "../../api/authService";
import "./ProfileDashboard.css";

export default function ProfileDashboard({ compact = false, onPlay }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        // Set default user nếu lỗi
        setUser({
          full_name: "Guest",
          wins: 0,
          losses: 0,
          draws: 0,
          avatar: "http://localhost:8000/media/avatar/default.jpg",
        });
      }
    };

    fetchUser();
  }, []);

  if (!user) return <div className="loading">Loading...</div>;

  return (
    <div className={`profile-card ${compact ? "compact" : ""}`}>
      <img src={user.avatar} alt="avatar" className="avatar" />

      <div className="profile-info">
        <strong>{user.full_name}</strong>

        <div className="stats">
          <span className="win">W {user.wins}</span>
          <span className="loss">L {user.losses}</span>
          <span className="draw">D {user.draws}</span>
        </div>
      </div>

      {onPlay && !compact && (
        <button onClick={onPlay} className="play-btn">
          Play Online
        </button>
      )}
    </div>
  );
}
