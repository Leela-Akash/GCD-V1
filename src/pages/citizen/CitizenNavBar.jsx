import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiUser, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { logOut } from "../../services/firebase";

// Styles
import "./CitizenNavBar.css";

export default function CitizenNavBar({ children }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logOut();
      localStorage.clear();
      sessionStorage.clear();
      navigate("/citizen/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="citizen-app-container">
      <nav className={`citizen-navbar ${isMenuOpen ? "open" : ""}`}>
        <div className="citizen-sidebar-header">
          <div className="citizen-logo">
            <span className="citizen-logo-icon">🏛️</span>
            <span className="citizen-logo-text">UrbanVoice Citizen</span>
          </div>
          <button className="citizen-sidebar-close" onClick={toggleMenu}>
            <FiX />
          </button>
        </div>

        <ul className="citizen-nav-links">
          <li>
            <NavLink to="/citizen/dashboard" onClick={() => setIsMenuOpen(false)}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/citizen/profile" onClick={() => setIsMenuOpen(false)}>
              Profile
            </NavLink>
          </li>
          <li>
            <NavLink to="/citizen/raise" onClick={() => setIsMenuOpen(false)}>
              Raise Complaint
            </NavLink>
          </li>
          <li>
            <NavLink to="/citizen/status" onClick={() => setIsMenuOpen(false)}>
              Check Status
            </NavLink>
          </li>
        </ul>

        <div className="citizen-user-section">
          <div className="citizen-user-info">
            <FiUser className="citizen-user-icon" />
            <span>{localStorage.getItem("citizenUsername") || "Citizen"}</span>
          </div>
          <button className="citizen-logout-btn" onClick={handleLogout}>
            <FiLogOut />
            Logout
          </button>
        </div>
      </nav>

      {isMenuOpen && <div className="citizen-overlay" onClick={toggleMenu}></div>}

      <div className="citizen-content">
        <button className="citizen-menu-toggle" onClick={toggleMenu}>
          {isMenuOpen ? (
            <>
              <FiX />
              Close Menu
            </>
          ) : (
            <>
              <FiMenu />
              Menu
            </>
          )}
        </button>

        <main className="citizen-main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
