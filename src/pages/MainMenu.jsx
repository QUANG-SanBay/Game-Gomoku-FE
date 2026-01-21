import { useNavigate } from "react-router-dom";
import ProfileDashboard from "../components/ProfileDashboard/ProfileDashboard";
import { logout } from "../utils/auth";
import "./MainMenu.css";

export default function MainMenu() {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Đăng xuất khỏi game?")) {
      logout();
    }
  };

  return (
    <div className="mainmenu-bg">
      {/* PROFILE GÓC PHẢI */}
      <div
        className="profile-top-right"
        onClick={() => navigate("/profile")}
        style={{ cursor: "pointer" }}
      >
        <ProfileDashboard compact />
      </div>

      {/* MENU GIỮA */}
      <div className="menu-center">
        <button
          className="menu-btn primary"
          onClick={() => navigate("/rooms")}
        >
          🏠 Danh sách phòng
        </button>

        <button 
          className="menu-btn"
          onClick={() => navigate("/offline")}
        >
          🤖 Đấu với máy
        </button>

        <button
          className="menu-btn"
          onClick={() => navigate("/leaderboard")}
        >
          🏆 Bảng xếp hạng
        </button>

        <button 
          className="menu-btn danger"
          onClick={handleLogout}
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
