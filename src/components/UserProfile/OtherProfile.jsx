import { useEffect, useState } from "react";
import { getUserById } from "../../api/userService";
import "./UserProfile.css";

export default function OtherProfile({ userId, onBack }) {
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

  if (error) return <div className="error-message">{error}</div>;
  if (!user) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-page">
      <button onClick={onBack}>⬅ Back</button>

      <img src={user.avatar} alt="avatar" className="avatar" />
      <h2>{user.full_name}</h2>

      <div className="stats">
        <p>Wins: {user.wins}</p>
        <p>Losses: {user.losses}</p>
        <p>Draws: {user.draws}</p>
      </div>
    </div>
  );
}
