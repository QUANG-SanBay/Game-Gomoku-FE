import { useState } from "react";
import { registerApi } from "../../api/authApi";
import "./Register.css";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerApi({
        full_name: fullName,
        email,
        password,
      });
      setMessage("Đăng ký thành công! Vui lòng đăng nhập.");
    } catch (err) {
      setMessage("Đăng ký thất bại");
    }
  };

  return (
    <div className="register-container">
      <h2>Đăng ký</h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Họ tên"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Đăng ký</button>
      </form>
    </div>
  );
}

export default Register;
