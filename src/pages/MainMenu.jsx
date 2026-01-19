import ProfileDashboard from "../components/ProfileDashboard/ProfileDashboard";
import "./MainMenu.css";

export default function MainMenu({
  onPlayOnline,
  onLeaderboard,
}) {
  return (
    <div className="mainmenu-bg">
      {/* PROFILE GÓC PHẢI */}
      <div className="profile-top-right">
        <ProfileDashboard compact />
      </div>

      {/* MENU GIỮA */}
      <div className="menu-center">
        <button
          className="menu-btn primary"
          onClick={onPlayOnline}
        >
          ▶ Chơi Online
        </button>

        <button className="menu-btn">
          🤖 Đấu với máy
        </button>

        <button
          className="menu-btn"
          onClick={onLeaderboard}
        >
          🏆 Bảng xếp hạng
        </button>

        <button className="menu-btn danger">
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
