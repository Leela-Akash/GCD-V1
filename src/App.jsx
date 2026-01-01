import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from "react-router-dom";

import CardNav from "./components/common/CardNav";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Public pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";

// Admin
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";

// Citizen
import CitizenLogin from "./pages/citizen/CitizenLogin";
import CitizenRegister from "./pages/citizen/CitizenRegister";
import CitizenLayout from "./pages/citizen/CitizenLayout";

// Assets
import googleLogo from "./assets/icons/google.jpeg";

const Layout = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  // Hide public navbar on admin & citizen internal pages
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isCitizenInternalRoute =
    location.pathname.startsWith("/citizen") &&
    !location.pathname.includes("/login") &&
    !location.pathname.includes("/register");

  const getNavItems = () => {
    const baseItems = [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" }
    ];

    if (user) {
      return [
        ...baseItems,
        { label: "Dashboard", href: "/citizen/dashboard" },
        {
          label: `${user.displayName || user.email} ▼`,
          subitems: [
            { label: "Profile", href: "/citizen/profile" },
            { label: "My Complaints", href: "/citizen/complaint-status" },
            { label: "Logout", href: "#", onClick: logout }
          ]
        }
      ];
    }

    return [
      ...baseItems,
      { label: "Register", href: "/citizen/register" },
      {
        label: "Login",
        subitems: [
          { label: "Admin Login", href: "/admin/login" },
          { label: "Citizen Login", href: "/citizen/login" }
        ]
      }
    ];
  };

  return (
    <>
      {/* 🌐 PUBLIC NAVBAR */}
      {!isAdminRoute && !isCitizenInternalRoute && (
        <CardNav
          logo={googleLogo}
          logoAlt="Google Logo"
          items={getNavItems()}
          activeHref={location.pathname}
          baseColor="#af99f6"
          pillColor="#ffffff"
          pillTextColor="#000000"
          hoveredPillTextColor="#000000"
        />
      )}

      {/* 🧭 ROUTES */}
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* ADMIN */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminLayout />} />

        {/* CITIZEN */}
        <Route path="/citizen/login" element={<CitizenLogin />} />
        <Route path="/citizen/register" element={<CitizenRegister />} />
        <Route path="/citizen/*" element={<CitizenLayout />} />
      </Routes>
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout />
      </Router>
    </AuthProvider>
  );
}
