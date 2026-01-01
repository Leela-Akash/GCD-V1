import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle, registerWithEmail } from "../../services/firebase";
import ElectricBorder from "../../components/effects/ElectricBorder";
import "./CitizenLogin.css";

const CitizenRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignUp = async () => {
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
      setError("Failed to register with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      
      const user = await registerWithEmail(email, password, name);
      
      localStorage.setItem("citizenLoggedIn", "true");
      localStorage.setItem("citizenUsername", user.displayName || user.email);
      localStorage.setItem("citizenEmail", user.email);
      sessionStorage.setItem("citizenLoggedIn", "true");
      sessionStorage.setItem("citizenUsername", user.displayName || user.email);
      
      navigate("/citizen/dashboard");
    } catch (error) {
      setError("Registration failed. Email may already be in use.");
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
          <h2 className="admin-title">Citizen Registration</h2>

          {error && <p className="error-message">{error}</p>}

          <form onSubmit={handleEmailRegister}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
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
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <button 
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="google-signin-btn"
          >
            {loading ? "Creating account..." : "🔍 Sign up with Google"}
          </button>
          
          <div className="login-link">
            <p>Already have an account? <a href="/citizen/login">Login here</a></p>
          </div>
        </div>
      </ElectricBorder>
    </div>
  );
};

export default CitizenRegister;
