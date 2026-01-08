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
      // Try Firebase admin auth first
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
        localStorage.setItem("adminLoggedIn", "true");
        localStorage.setItem("adminData", JSON.stringify(data.admin));
        sessionStorage.setItem("adminLoggedIn", "true");
        
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
        // Fallback to simple auth if Firebase admin not found
        if (email === "admin@civicsense.ai" && password === "admin123") {
          localStorage.setItem("adminLoggedIn", "true");
          sessionStorage.setItem("adminLoggedIn", "true");
          navigate("/admin/dashboard");
        } else {
          setError("Admin not found. Initialize system first or use correct credentials.");
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      // Fallback to simple auth on network error
      if (email === "admin@civicsense.ai" && password === "admin123") {
        localStorage.setItem("adminLoggedIn", "true");
        sessionStorage.setItem("adminLoggedIn", "true");
        navigate("/admin/dashboard");
      } else {
        setError("Network error or invalid credentials.");
      }
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
        </div>
      </ElectricBorder>
    </div>
  );
};

export default AdminLogin;
