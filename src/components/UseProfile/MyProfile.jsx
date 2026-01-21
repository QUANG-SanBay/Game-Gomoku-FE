import { useEffect, useState } from "react";
import "./UserProfile.css";

function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Chưa đăng nhập");
      return;
    }

    fetch("http://localhost:8000/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Không lấy được profile");
        return res.json();
      })
      .then(data => setProfile(data))
      .catch(err => setError(err.message));
  }, []);

  if (error) return <div>{error}</div>;
  if (!profile) return <div>Loading...</div>;

  return (
    <div className="user-profile">
      <img src={profile.avatar} className="avatar" />
      <h2>{profile.full_name}</h2>
      <p>Elo: {profile.elo}</p>

      <div className="stats">
        <span>🏆 {profile.wins}</span>
        <span>❌ {profile.losses}</span>
        <span>🤝 {profile.draws}</span>
      </div>
    </div>
  );
}

export default MyProfile;
