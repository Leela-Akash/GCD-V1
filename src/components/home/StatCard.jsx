import React from 'react';

const StatCard = ({ label, value, suffix = "" }) => {
  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "16px",
        padding: "40px 30px",
        textAlign: "center",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease"
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = "translateY(-5px)";
        e.target.style.boxShadow = "0 12px 40px rgba(175, 153, 246, 0.2)";
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = "translateY(0)";
        e.target.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.3)";
      }}
    >
      <div
        className="counter"
        style={{
          fontSize: "3rem",
          fontWeight: "bold",
          background: "linear-gradient(135deg, #4285F4, #AF99F6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          marginBottom: "10px"
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: "1.1rem",
          color: "#ccc",
          fontWeight: "500"
        }}
      >
        {label}
      </div>
    </div>
  );
};

export default StatCard;