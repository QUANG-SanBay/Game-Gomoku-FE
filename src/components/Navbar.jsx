import { logout } from "../utils/auth";

function Navbar() {
  return (
    <nav>
      <button onClick={logout}>Đăng xuất</button>
    </nav>
  );
}

export default Navbar;
