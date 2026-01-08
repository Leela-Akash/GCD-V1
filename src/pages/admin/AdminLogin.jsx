import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ElectricBorder from "../../components/effects/ElectricBorder";
import "./AdminLogin.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password, 
          action: 'login' 
        })
      });

      const data = await response.json();

      if (data.success) {
        // Store admin session
        localStorage.setItem("adminLoggedIn", "true");
        localStorage.setItem("adminData", JSON.stringify(data.admin));
        sessionStorage.setItem("adminLoggedIn", "true");
        
        // Log admin activity
        await fetch('/api/admin-activity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            adminId: data.admin.id,
            action: 'login',
            details: 'Admin logged in successfully'
          })
        });
        
        navigate("/admin/dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (error) {
      console.error('Login error:', error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="admin-login-page">
      <button className="back-button" onClick={handleBack}>
        ← Back to Home
      </button>
      
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
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          
          <p className="demo-note">
            Demo: admin@civicsense.ai / admin123
          </p>
        </div>
      </ElectricBorder>
    </div>
  );
};

export default AdminLogin;
