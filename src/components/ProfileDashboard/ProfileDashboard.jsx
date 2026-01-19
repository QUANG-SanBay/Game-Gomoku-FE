import "./ProfileDashboard.css";

export default function ProfileDashboard({ compact }) {
  const user = {
    full_name: "Nguyễn Văn A",
    wins: 0,
    losses: 0,
    draws: 0,
    avatar: "http://localhost:8000/media/avatar/avatar1.jpg",
  };

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
    </div>
  );
}
