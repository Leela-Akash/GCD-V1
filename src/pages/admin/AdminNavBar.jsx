import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiUser, FiLogOut, FiMenu, FiX } from "react-icons/fi";

// Styles
import "./AdminNavBar.css";

export default function AdminNavBar({ children }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleLogout() {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/admin/login", { replace: true });
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="admin-app-container">
      <nav className={`admin-navbar ${isMenuOpen ? "open" : ""}`}>
        <div className="admin-sidebar-header">
          <div className="admin-logo">
            <span className="admin-logo-icon">🛡️</span>
            <span className="admin-logo-text">UrbanVoice Admin</span>
          </div>
          <button className="admin-sidebar-close" onClick={toggleMenu}>
            <FiX />
          </button>
        </div>

        <ul className="admin-nav-links">
          <li>
            <NavLink to="/admin/dashboard" onClick={() => setIsMenuOpen(false)}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/manage-complaints" onClick={() => setIsMenuOpen(false)}>
              Manage Complaints
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/reports" onClick={() => setIsMenuOpen(false)}>
              Reports & Analytics
            </NavLink>
          </li>
        </ul>

        <div className="admin-user-section">
          <div className="admin-user-info">
            <FiUser className="admin-user-icon" />
            <span>Admin</span>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <FiLogOut />
            Logout
          </button>
        </div>
      </nav>

      {isMenuOpen && <div className="admin-overlay" onClick={toggleMenu}></div>}

      <div className="admin-content">
        <button className="admin-menu-toggle" onClick={toggleMenu}>
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

        <main className="admin-main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
