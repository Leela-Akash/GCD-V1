const WhyCard = ({ title, description }) => {
  return (
    <div
      style={{
        background: "rgba(28, 24, 48, 0.7)",
        backdropFilter: "blur(12px)",
        borderRadius: "20px",
        padding: "30px",
        border: "1px solid rgba(175,153,246,0.25)",
        boxShadow: "0 0 40px rgba(175,153,246,0.12)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        color: "#e6e3ff",
        minHeight: "180px"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow =
          "0 0 60px rgba(175,153,246,0.25)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 0 40px rgba(175,153,246,0.12)";
      }}
    >
      <h3
        style={{
          fontSize: "1.25rem",
          fontWeight: "600",
          marginBottom: "14px",
          color: "#AF99F6"
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: "0.95rem",
          lineHeight: 1.6,
          color: "#c9c5e8"
        }}
      >
        {description}
      </p>
    </div>
  );
};

export default WhyCard;
