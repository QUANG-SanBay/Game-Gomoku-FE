import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={{ padding: "10px 20px", background: "#333", color: "white" }}>
      <button 
        onClick={handleLogout}
        style={{
          padding: "8px 16px",
          background: "#f44336",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Đăng xuất
      </button>
    </nav>
  );
}

export default Navbar;
