import React from 'react';

const StatCard = ({ label, suffix }) => {
  return (
    <div
      className="card"
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "16px",
        padding: "30px",
        textAlign: "center",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)"
      }}
    >
      <div
        style={{
          fontSize: "3rem",
          fontWeight: "bold",
          color: "#AF99F6",
          marginBottom: "10px"
        }}
      >
        <span className="counter">0</span>
        <span>{suffix}</span>
      </div>
      <p style={{ color: "#ccc", fontSize: "1.1rem" }}>
        {label}
      </p>
    </div>
  );
};

export default StatCard;
