import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import CardNav from "./components/common/CardNav";
import viteLogo from "/vite.svg";
import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import RaiseComplaint from "./pages/citizen/RaiseComplaint";
import ComplaintStatus from "./pages/citizen/ComplaintStatus";
import AdminComplaints from "./pages/admin/AdminComplaints";


// dummy pages
const Home = () => <h1 style={{ color: "#fff" }}>Home</h1>;
const About = () => <h1 style={{ color: "#fff" }}>About</h1>;
const Services = () => <h1 style={{ color: "#fff" }}>Services</h1>;
const Contact = () => <h1 style={{ color: "#fff" }}>Contact</h1>;

const Layout = () => {
  const location = useLocation();

  return (
    <>
      <CardNav
  logo={viteLogo}
  logoAlt="Vite Logo"
  items={[
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" }
  ]}
  activeHref={location.pathname}
  className="custom-nav"
  ease="power2.easeOut"
  baseColor="#af99f6"        // 🟣 NAVBAR (VIOLET)
  pillColor="#ffffff"        // ⬛ PILLS
  hoveredPillTextColor="#000000"
  pillTextColor="#000000"   // ⚪ TEXT
/>


      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/citizen-dashboard" element={<CitizenDashboard />} />
        <Route path="/raise-complaint" element={<RaiseComplaint />} />
        <Route path="/complaint-status" element={<ComplaintStatus />} />
        <Route path="/admin-complaints" element={<AdminComplaints />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
