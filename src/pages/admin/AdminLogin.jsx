import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ElectricBorder from "../../components/effects/ElectricBorder";
import "./AdminLogin.css";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    setError("");

    // Simple admin authentication
    if (username === "admin" && password === "admin") {
      localStorage.setItem("adminLoggedIn", "true");
      sessionStorage.setItem("adminLoggedIn", "true");
      navigate("/admin/dashboard");
    } else {
      setError("Invalid credentials. Use admin/admin");
    }
  };

  return (
    <div className="admin-login-page">
      <ElectricBorder
        color="#AF99F6"
        speed={1.2}
        chaos={1.1}
        thickness={2}
        className="admin-login-border"
      >
        <div className="admin-login-card">
          <h2 className="admin-title">Admin Login</h2>

          {error && <p className="error-message">{error}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />

            <button type="submit">Login</button>
          </form>
        </div>
      </ElectricBorder>
    </div>
  );
};

export default AdminLogin;
