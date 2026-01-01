import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import ManageComplaints from "./ManageComplaints";
import PendingComplaints from "./PendingComplaints";
import ResolvedComplaints from "./ResolvedComplaints";
import HighPriorityComplaints from "./HighPriorityComplaints";
import ReportsAndAnalytics from "./ReportsAndAnalytics";

export default function AdminLayout() {
  return (
    <>
      <Routes>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="manage-complaints" element={<ManageComplaints />} />
        <Route path="pending-complaints" element={<PendingComplaints />} />
        <Route path="resolved-complaints" element={<ResolvedComplaints />} />
        <Route path="high-priority" element={<HighPriorityComplaints />} />
        <Route path="reports" element={<ReportsAndAnalytics />} />
      </Routes>
    </>
  );
}
