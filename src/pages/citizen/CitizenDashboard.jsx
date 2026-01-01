import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import "./CitizenDashboard.css";

const CitizenDashboard = () => {
  const navigate = useNavigate();

  const handleMouseMove = (e, ref, color) => {
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ref.current.style.setProperty("--mouse-x", `${x}px`);
    ref.current.style.setProperty("--mouse-y", `${y}px`);
    ref.current.style.setProperty("--spotlight-color", color);
  };

  const raiseRef = useRef(null);
  const statusRef = useRef(null);

  return (
    <div className="citizen-dashboard-wrapper">

      <h1 className="dashboard-title">Citizen Dashboard</h1>

      <div className="dashboard-cards">

        {/* RAISE COMPLAINT */}
        <div
          ref={raiseRef}
          className="dashboard-card spotlight-card"
          onMouseMove={(e) =>
            handleMouseMove(e, raiseRef, "rgba(175, 153, 246, 0.35)")
          }
          onClick={() => navigate("/citizen/raise-complaint")}
        >
          <h2>Raise Complaint</h2>
          <p>Submit complaints using text, voice, or image.</p>
        </div>

        {/* COMPLAINT STATUS */}
        <div
          ref={statusRef}
          className="dashboard-card spotlight-card"
          onMouseMove={(e) =>
            handleMouseMove(e, statusRef, "rgba(0, 229, 255, 0.3)")
          }
          onClick={() => navigate("/citizen/complaint-status")}
        >
          <h2>Complaint Status</h2>
          <p>Track updates and AI-generated insights.</p>
        </div>

      </div>
    </div>
  );
};

export default CitizenDashboard;
