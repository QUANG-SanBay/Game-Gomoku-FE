import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../api/authService";
import "./Register.css";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError("");

    if (password !== confirmPassword) {
      setErrors({ confirm_password: "Mật khẩu nhập lại không khớp!" });
      return;
    }
    
    try {
      await register({
        full_name: fullName,
        email,
        password,
        confirm_password: confirmPassword,
      });
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (err) {
      // Parse error từ backend
      if (err.response?.data) {
        const errorData = err.response.data;
        
        // Nếu có lỗi theo từng field (email, password, etc.)
        if (typeof errorData === 'object' && !errorData.message && !errorData.detail) {
          const fieldErrors = {};
          Object.keys(errorData).forEach(key => {
            const value = errorData[key];
            fieldErrors[key] = Array.isArray(value) ? value[0] : value;
          });
          setErrors(fieldErrors);
        }
        // Nếu có message chung
        else if (errorData.message) {
          setGeneralError(errorData.message);
        }
        // Nếu có detail
        else if (errorData.detail) {
          setGeneralError(errorData.detail);
        }
        else {
          setGeneralError("Đăng ký thất bại");
        }
      } else {
        setGeneralError("Đăng ký thất bại");
      }
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-box">
        <h2 className="auth-title">Đăng Ký</h2>

        {generalError && <p style={{color: 'red', marginBottom: '10px'}}>{generalError}</p>}

        <form className="auth-form" onSubmit={handleRegister}>
          <div className="input-group">
            <label>Họ tên</label>
            <input
              type="text"
              className="auth-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="Nhập họ và tên..."
            />
            {errors.full_name && <p style={{color: 'red', fontSize: '12px', marginTop: '5px'}}>{errors.full_name}</p>}
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@email.com"
            />
            {errors.email && <p style={{color: 'red', fontSize: '12px', marginTop: '5px'}}>{errors.email}</p>}
          </div>

          <div className="input-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
            {errors.password && <p style={{color: 'red', fontSize: '12px', marginTop: '5px'}}>{errors.password}</p>}
          </div>

          <div className="input-group">
            <label>Nhập lại mật khẩu</label>
            <input
              type="password"
              className="auth-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
            {errors.confirm_password && <p style={{color: 'red', fontSize: '12px', marginTop: '5px'}}>{errors.confirm_password}</p>}
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
