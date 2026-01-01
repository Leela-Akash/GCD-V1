import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function CitizenProfile() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");

  const handleSave = () => {
    alert("Profile updated successfully!");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#050508",
      color: "#fff",
      padding: "80px 20px 40px"
    }}>
      <div style={{
        maxWidth: "600px",
        margin: "0 auto",
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(175, 153, 246, 0.3)",
        borderRadius: "20px",
        padding: "40px"
      }}>
        <h1 style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "40px",
          background: "linear-gradient(135deg, #4285F4, #AF99F6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>Profile</h1>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(175, 153, 246, 0.3)",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "1rem"
              }}
            />
          </div>
          
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(175, 153, 246, 0.2)",
                borderRadius: "8px",
                color: "#ccc",
                fontSize: "1rem"
              }}
            />
          </div>
          
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Phone:</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(175, 153, 246, 0.3)",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "1rem"
              }}
            />
          </div>
          
          <button 
            onClick={handleSave}
            style={{
              padding: "12px 24px",
              background: "linear-gradient(135deg, #4285F4, #34A853)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
              marginTop: "20px",
              transition: "transform 0.2s"
            }}
            onMouseEnter={(e) => e.target.style.transform = "scale(1.02)"}
            onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}
