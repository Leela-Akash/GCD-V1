import { Routes, Route } from "react-router-dom";
import CitizenNavBar from "./CitizenNavBar";
import CitizenDashboard from "./CitizenDashboard";
import RaiseComplaint from "./RaiseComplaint";
import ComplaintStatus from "./ComplaintStatus";
import CitizenProfile from "./CitizenProfile";

export default function CitizenLayout() {
  return (
    <CitizenNavBar>
      <Routes>
        <Route path="dashboard" element={<CitizenDashboard />} />
        <Route path="raise-complaint" element={<RaiseComplaint />} />
        <Route path="complaint-status" element={<ComplaintStatus />} />
        <Route path="profile" element={<CitizenProfile />} />
      </Routes>
    </CitizenNavBar>
  );
}
