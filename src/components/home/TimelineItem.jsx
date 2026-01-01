import React from 'react';

const TimelineItem = ({ step, index }) => {
  return (
    <div
      className="timeline-item card"
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "16px",
        padding: "20px",
        textAlign: "center",
        width: "180px",
        position: "relative",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)"
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          background: "linear-gradient(135deg, #4285F4, #AF99F6)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 15px",
          fontWeight: "bold",
          color: "#fff"
        }}
      >
        {index + 1}
      </div>
      <p style={{ color: "#ccc", fontSize: "0.9rem", lineHeight: "1.4" }}>
        {step}
      </p>
    </div>
  );
};

export default TimelineItem;
