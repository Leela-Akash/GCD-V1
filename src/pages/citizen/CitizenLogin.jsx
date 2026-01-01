import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle, signInWithEmail } from "../../services/firebase";
import ElectricBorder from "../../components/effects/ElectricBorder";
import "./CitizenLogin.css";

const CitizenLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError("");
      
      const user = await signInWithGoogle();
      
      localStorage.setItem("citizenLoggedIn", "true");
      localStorage.setItem("citizenUsername", user.displayName || user.email);
      localStorage.setItem("citizenEmail", user.email);
      sessionStorage.setItem("citizenLoggedIn", "true");
      sessionStorage.setItem("citizenUsername", user.displayName || user.email);
      
      navigate("/citizen/dashboard");
    } catch (error) {
      setError("Failed to sign in with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      
      const user = await signInWithEmail(email, password);
      
      localStorage.setItem("citizenLoggedIn", "true");
      localStorage.setItem("citizenUsername", user.displayName || user.email);
      localStorage.setItem("citizenEmail", user.email);
      sessionStorage.setItem("citizenLoggedIn", "true");
      sessionStorage.setItem("citizenUsername", user.displayName || user.email);
      
      navigate("/citizen/dashboard");
    } catch (error) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
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
          <h2 className="admin-title">Citizen Login</h2>

          {error && <p className="error-message">{error}</p>}

          <form onSubmit={handleEmailSignIn}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <button 
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="google-signin-btn"
          >
            {loading ? "Signing in..." : "🔍 Sign in with Google"}
          </button>
          
          <div className="register-link">
            <p>New to CivicSense AI? <a href="/citizen/register">Register here</a></p>
          </div>
        </div>
      </ElectricBorder>
    </div>
  );
};

export default CitizenLogin;
