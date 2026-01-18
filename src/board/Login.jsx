import React, { useState } from 'react';
import './Auth.css';

const Login = ({ onLogin, onSwitchToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      onLogin(username, password);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-box">
        <h2 className="auth-title">Đăng Nhập</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Tên đăng nhập</label>
            <input 
              type="text" 
              className="auth-input" 
              placeholder="Nhập tên của bạn..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            />
          </div>
          <button type="submit" className="auth-btn-primary">Vào Game Ngay</button>
        </form>
        <div className="auth-switch-wrapper">
          Chưa có tài khoản? 
          <button className="auth-switch-btn" onClick={onSwitchToRegister}>Đăng ký ngay</button>
        </div>
      </div>
    </div>
  );
};

export default Login;