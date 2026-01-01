import React from 'react';

const SpotlightCard = ({ icon, title, description, colorIndex }) => {
  const googleColors = [
    { primary: '#4285F4', secondary: '#357AE8', accent: '#1A73E8' }, // Blue
    { primary: '#34A853', secondary: '#2E7D32', accent: '#1B5E20' }, // Green
    { primary: '#F4B400', secondary: '#F57C00', accent: '#EF6C00' }, // Yellow/Orange
    { primary: '#DB4437', secondary: '#C62828', accent: '#B71C1C' }, // Red
    { primary: '#AF99F6', secondary: '#9C27B0', accent: '#7B1FA2' }, // Purple
    { primary: '#00ACC1', secondary: '#00838F', accent: '#006064' }, // Cyan
    { primary: '#FF7043', secondary: '#F4511E', accent: '#D84315' }, // Orange
    { primary: '#8BC34A', secondary: '#689F38', accent: '#558B2F' }, // Light Green
    { primary: '#E91E63', secondary: '#C2185B', accent: '#AD1457' }  // Pink
  ];

  const color = googleColors[colorIndex % googleColors.length];

  return (
    <div
      className="spotlight-card"
      style={{
        background: "#050508",
        border: `1px solid rgba(${hexToRgb(color.primary)}, 0.3)`,
        borderRadius: "20px",
        padding: "40px",
        textAlign: "center",
        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        transform: "perspective(1000px) rotateX(0deg)"
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = "perspective(1000px) rotateX(-5deg) translateY(-15px) scale(1.02)";
        e.target.style.borderColor = `rgba(${hexToRgb(color.primary)}, 0.6)`;
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = "perspective(1000px) rotateX(0deg) translateY(0) scale(1)";
        e.target.style.borderColor = `rgba(${hexToRgb(color.primary)}, 0.3)`;
      }}
    >
      <div
        style={{
          fontSize: "3.5rem",
          marginBottom: "25px",
          transition: "transform 0.3s ease",
          animation: "float 3s ease-in-out infinite"
        }}
        className="card-icon"
      >
        {icon}
      </div>
      <h3
        style={{
          fontSize: "1.6rem",
          fontWeight: "bold",
          marginBottom: "15px",
          background: `linear-gradient(135deg, ${color.primary}, ${color.secondary})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          transition: "all 0.3s ease"
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: "1rem",
          color: "#ddd",
          lineHeight: "1.6",
          transition: "color 0.3s ease"
        }}
      >
        {description}
      </p>

    </div>
  );
};

// Helper function to convert hex to rgb
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
}

export default SpotlightCard;
