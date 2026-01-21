import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProfile, updateMyProfile } from "../../api/userService";
import "./UserProfile.css";

function MyProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: "",
    email: "",
    avatar: null
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getMyProfile();
      console.log("Fetched profile:", response.data);
      setProfile(response.data);
      setEditForm({
        full_name: response.data.full_name || "",
        email: response.data.email || "",
        avatar: null
      });
      setError(null);
    } catch (err) {
      console.error("Fetch profile error:", err);
      setError(err.response?.data?.message || "Không lấy được profile");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditForm({ ...editForm, avatar: file });
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const dataToUpdate = {};
      
      // Luôn gửi full_name và email nếu đã thay đổi
      if (editForm.full_name && editForm.full_name !== profile.full_name) {
        dataToUpdate.full_name = editForm.full_name;
      }
      if (editForm.email && editForm.email !== profile.email) {
        dataToUpdate.email = editForm.email;
      }
      if (editForm.avatar) {
        dataToUpdate.avatar = editForm.avatar;
      }

      if (Object.keys(dataToUpdate).length > 0) {
        console.log("Updating profile with:", dataToUpdate);
        const response = await updateMyProfile(dataToUpdate);
        console.log("Update response:", response.data);
        
        // Cập nhật lại profile từ response
        setProfile(response.data);
        setEditForm({
          full_name: response.data.full_name || "",
          email: response.data.email || "",
          avatar: null
        });
        setIsEditing(false);
        setAvatarPreview(null);
        alert("Cập nhật thành công!");
      } else {
        alert("Không có thay đổi nào để lưu");
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Update profile error:", err);
      const errorMsg = err.response?.data?.message || 
                       err.response?.data?.detail || 
                       JSON.stringify(err.response?.data) ||
                       "Cập nhật thất bại";
      alert(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (error) return <div className="error-message">{error}</div>;
  if (!profile) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-page-container">
      <button onClick={() => navigate("/")} className="back-btn">
        ⬅ Menu
      </button>

      <div className="user-profile-card">
        <div className="profile-header">
          <div className="avatar-container">
            <img 
              src={avatarPreview || profile.avatar || "https://via.placeholder.com/140?text=Avatar"} 
              alt="avatar" 
              className="avatar" 
            />
            {isEditing && (
              <label className="avatar-upload-btn">
                📷
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </label>
            )}
          </div>
          
          {/* Luôn hiển thị thông tin, chỉ hiển thị input khi edit */}
          {!isEditing ? (
            <>
              <h2>{profile.full_name || "Chưa có tên"}</h2>
              <p className="username">@{profile.username}</p>
              <p className="email">{profile.email || "Chưa có email"}</p>
              <div className="elo-badge">Elo: {profile.elo}</div>
            </>
          ) : (
            <>
              <div className="edit-form">
                <input
                  type="text"
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  placeholder="Họ tên"
                  className="edit-input"
                />
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  placeholder="Email"
                  className="edit-input"
                />
              </div>
              <p className="username">@{profile.username}</p>
              <div className="elo-badge">Elo: {profile.elo}</div>
            </>
          )}
        </div>

        <div className="stats-grid">
          <div className="stat-item win">
            <div className="stat-icon">🏆</div>
            <div className="stat-label">Thắng</div>
            <div className="stat-value">{profile.wins}</div>
          </div>
          <div className="stat-item loss">
            <div className="stat-icon">❌</div>
            <div className="stat-label">Thua</div>
            <div className="stat-value">{profile.losses}</div>
          </div>
          <div className="stat-item draw">
            <div className="stat-icon">🤝</div>
            <div className="stat-label">Hòa</div>
            <div className="stat-value">{profile.draws}</div>
          </div>
        </div>

        <div className="profile-actions">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="btn-edit">
              ✏️ Chỉnh sửa
            </button>
          ) : (
            <>
              <button 
                onClick={handleSave} 
                disabled={saving}
                className="btn-save"
              >
                {saving ? "Đang lưu..." : "💾 Lưu"}
              </button>
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setAvatarPreview(null);
                  setEditForm({
                    full_name: profile.full_name || "",
                    email: profile.email || "",
                    avatar: null
                  });
                }} 
                className="btn-cancel"
              >
                ❌ Hủy
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
