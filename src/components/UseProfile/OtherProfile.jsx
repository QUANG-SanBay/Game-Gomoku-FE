import { useEffect, useState } from "react";
import "./UserProfile.css";

export default function OtherProfile({ userId, onBack }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // giả lập fetch
    setUser({
      id: userId,
      full_name: `User ${userId}`,
      wins: 10,
      losses: 5,
      draws: 2,
      avatar: "http://localhost:8000/media/avatar/avatar1.jpg",
    });
  }, [userId]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile-page">
      <button onClick={onBack}>⬅ Back</button>

      <img src={user.avatar} alt="avatar" />
      <h2>{user.full_name}</h2>

      <p>Wins: {user.wins}</p>
      <p>Losses: {user.losses}</p>
      <p>Draws: {user.draws}</p>
    </div>
  );
}
