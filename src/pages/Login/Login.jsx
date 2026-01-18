import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // --- LOGIC ĐĂNG NHẬP CỦA BẠN SẼ Ở ĐÂY ---
    // Ví dụ: gọi API, lưu token vào localStorage, rồi chuyển hướng
    console.log('Đăng nhập với:', username, password);
    
    // Giả sử đăng nhập thành công, bạn lưu token
    // localStorage.setItem('your_auth_token', 'some_jwt_token');
    
    navigate('/'); // Chuyển hướng về trang chủ (bàn cờ)
  };

  return (
    <div className="auth-overlay">
      <div className="auth-box">
        <h2 className="auth-title">Đăng Nhập</h2>
        <form className="auth-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label>Tên đăng nhập</label>
            <input
              type="text"
              className="auth-input"
              placeholder="Nhập tên của bạn..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              className="auth-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-btn-primary">Vào Game Ngay</button>
        </form>
        <div className="auth-switch-wrapper">
          Chưa có tài khoản?
          <Link to="/register" className="auth-switch-btn">Đăng ký ngay</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;