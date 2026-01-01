import React from 'react';

const WhyCard = ({ title, description }) => {
  return (
    <div
      className="card"
      style={{
        background: "linear-gradient(135deg, rgba(66, 133, 244, 0.1), rgba(175, 153, 246, 0.1))",
        backdropFilter: "blur(15px)",
        border: "1px solid rgba(175, 153, 246, 0.3)",
        borderRadius: "20px",
        padding: "35px",
        textAlign: "center",
        boxShadow: "0 12px 40px rgba(175, 153, 246, 0.2)",
        transition: "all 0.3s ease",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden"
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = "translateY(-8px)";
        e.target.style.boxShadow = "0 20px 60px rgba(175, 153, 246, 0.4)";
        e.target.style.borderColor = "rgba(175, 153, 246, 0.6)";
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = "translateY(0)";
        e.target.style.boxShadow = "0 12px 40px rgba(175, 153, 246, 0.2)";
        e.target.style.borderColor = "rgba(175, 153, 246, 0.3)";
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "linear-gradient(90deg, #4285F4, #AF99F6, #34A853)",
          borderRadius: "20px 20px 0 0"
        }}
      />
      <h3
        style={{
          fontSize: "1.6rem",
          fontWeight: "700",
          marginBottom: "18px",
          background: "linear-gradient(135deg, #4285F4, #AF99F6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}
      >
        {title}
      </h3>
      <p style={{ 
        color: "#e0e0e0", 
        lineHeight: "1.7",
        fontSize: "1.05rem"
      }}>
        {description}
      </p>
    </div>
  );
};

export default WhyCard;
