import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserById } from "../../api/userService";
import "./UserProfile.css";

export default function OtherProfile() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserById(userId);
        setUser(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Không lấy được thông tin user");
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  if (error) {
    return (
      <div className="profile-page-container">
        <button onClick={() => navigate("/leaderboard")} className="back-btn">
          ⬅ Quay lại
        </button>
        <div className="error-message">{error}</div>
      </div>
    );
  }
  
  if (!user) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-page-container">
      <button onClick={() => navigate("/leaderboard")} className="back-btn">
        ⬅ Bảng xếp hạng
      </button>

      <div className="user-profile-card">
        <div className="profile-header">
          <div className="avatar-container">
            <img 
              src={user.avatar || "https://via.placeholder.com/120"} 
              alt="avatar" 
              className="avatar" 
            />
          </div>
          
          <h2>{user.full_name}</h2>
          <p className="username">@{user.username}</p>
          <div className="elo-badge">Elo: {user.elo}</div>
        </div>

        <div className="stats-grid">
          <div className="stat-item win">
            <div className="stat-icon">🏆</div>
            <div className="stat-label">Thắng</div>
            <div className="stat-value">{user.wins}</div>
          </div>
          <div className="stat-item loss">
            <div className="stat-icon">❌</div>
            <div className="stat-label">Thua</div>
            <div className="stat-value">{user.losses}</div>
          </div>
          <div className="stat-item draw">
            <div className="stat-icon">🤝</div>
            <div className="stat-label">Hòa</div>
            <div className="stat-value">{user.draws}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
