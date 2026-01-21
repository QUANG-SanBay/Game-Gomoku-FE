import { useEffect, useState } from "react";
import { getCurrentUser } from "../../api/authService";
import "./UserProfile.css";

function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getCurrentUser();
        setProfile(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Không lấy được profile");
      }
    };

    fetchProfile();
  }, []);

  if (error) return <div className="error-message">{error}</div>;
  if (!profile) return <div className="loading">Loading...</div>;

  return (
    <div className="user-profile">
      <img src={profile.avatar} alt="avatar" className="avatar" />
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
