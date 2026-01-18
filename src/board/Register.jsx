import React, { useState } from 'react';
import './Auth.css';

const Register = ({ onRegister, onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPass) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    if (username && password) {
      onRegister(username, password);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-box">
        <h2 className="auth-title">Đăng Ký</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Tên hiển thị</label>
            <input 
              type="text" 
              className="auth-input" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Mật khẩu</label>
            <input 
              type="password" 
              className="auth-input" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Xác nhận mật khẩu</label>
            <input 
              type="password" 
              className="auth-input" 
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
            />
          </div>
          <button type="submit" className="auth-btn-primary">Tạo Tài Khoản</button>
        </form>
        <div className="auth-switch-wrapper">
          Đã có tài khoản? 
          <button className="auth-switch-btn" onClick={onSwitchToLogin}>Đăng nhập</button>
        </div>
      </div>
    </div>
  );
};

export default Register;