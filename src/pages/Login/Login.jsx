import { useState } from "react";
import { loginApi } from "../../api/authApi";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginApi({ email, password });
      localStorage.setItem("token", res.data.access_token);
      window.location.href = "/";
    } catch (err) {
      setError("Sai email hoặc mật khẩu");
    }
  };

  return (
    <div className="login-container">
      <h2>Đăng nhập</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleLogin}>
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

        <button type="submit">Đăng nhập</button>
      </form>
    </div>
  );
}

export default Login;
