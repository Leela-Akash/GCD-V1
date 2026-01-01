import React from 'react';

const FeatureCard = ({ title, description }) => {
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
      <h3
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          marginBottom: "15px",
          color: "#AF99F6"
        }}
      >
        {title}
      </h3>
      <p style={{ color: "#ccc", lineHeight: "1.6" }}>
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
