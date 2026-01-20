import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../api/authService';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      // Token đã được tự động lưu bởi authService.login()
      // Reload trang để App.jsx kiểm tra lại isLoggedIn()
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-box">
        <h2 className="auth-title">Đăng Nhập</h2>

        {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              className="auth-input"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
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
              disabled={loading}
            />
          </div>
          <button type="submit" className="auth-btn-primary" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Vào Game Ngay'}
          </button>
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