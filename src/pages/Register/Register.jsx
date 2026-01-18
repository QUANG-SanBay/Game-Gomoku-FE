import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerApi } from "../../api/authApi";
import "./Register.css";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerApi({
        full_name: fullName,
        email,
        password,
      });
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (err) {
      setMessage("Đăng ký thất bại");
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-box">
        <h2 className="auth-title">Đăng Ký</h2>

        {message && <p style={{color: 'red'}}>{message}</p>}

        <form className="auth-form" onSubmit={handleRegister}>
          <div className="input-group">
            <label>Họ tên</label>
            <input
              type="text"
              className="auth-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-btn-primary">Đăng Ký</button>
        </form>
        
        <div className="auth-switch-wrapper">
          Đã có tài khoản?
          <Link to="/login" className="auth-switch-btn">Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
