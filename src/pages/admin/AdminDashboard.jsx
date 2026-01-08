import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import AdminMagicBento from "./AdminMagicBento";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real-time listener for all complaints
    const q = query(
      collection(db, "complaints"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allComplaints = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
      setComplaints(allComplaints);
      setLoading(false);
      console.log('📊 Real-time admin dashboard update:', allComplaints.length, 'complaints');
    }, (error) => {
      console.error('Error fetching complaints:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const stats = {
    total: complaints.length,
    high: complaints.filter(c => c.priority === "HIGH" || c.priority === "CRITICAL").length,
    pending: complaints.filter(c => c.status === "pending" || c.status === "submitted" || c.status === "analyzed").length,
    resolved: complaints.filter(c => c.status === "resolved").length
  };

  const handleBack = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Loading Dashboard...</h2>
        </div>
      </div>
    );
  }

  const bentoCards = [
    {
      title: "Total Complaints",
      value: stats.total,
      icon: "📋",
      gradient: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
      description: "All submitted complaints",
      onClick: () => navigate("/admin/manage-complaints")
    },
    {
      title: "High Priority",
      value: stats.high,
      icon: "🚨",
      gradient: "linear-gradient(135deg, #1e40af, #2563eb)",
      description: "Critical & high priority issues",
      onClick: () => navigate("/admin/high-priority")
    },
    {
      title: "Pending Review",
      value: stats.pending,
      icon: "⏳",
      gradient: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
      description: "Awaiting admin action",
      onClick: () => navigate("/admin/pending-complaints")
    },
    {
      title: "Resolved",
      value: stats.resolved,
      icon: "✅",
      gradient: "linear-gradient(135deg, #1e40af, #60a5fa)",
      description: "Successfully completed",
      onClick: () => navigate("/admin/resolved-complaints")
    }
  ];

  const recentComplaints = complaints.slice(0, 5);

  return (
    <div className="admin-dashboard">
      <button className="back-button" onClick={handleBack}>
        ← Back to Home
      </button>
      
      <div className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <p className="dashboard-subtitle">
          CivicSense AI - Smart Complaint Management System
        </p>
        <div className="live-indicator">
          <span className="live-dot"></span>
          Live Updates
        </div>
      </div>

      <AdminMagicBento 
        cards={bentoCards}
        enableStars={true}
        glowColor="59, 130, 246"
      />

      <div className="dashboard-content">
        <div className="recent-complaints">
          <h2 className="section-title">Recent Complaints</h2>
          <div className="complaints-list">
            {recentComplaints.length > 0 ? (
              recentComplaints.map(complaint => (
                <div key={complaint.id} className="complaint-item">
                  <div className="complaint-info">
                    <div className="complaint-category">{complaint.category}</div>
                    <div className="complaint-desc">
                      {complaint.description.substring(0, 80)}...
                    </div>
                    <div className="complaint-meta">
                      <span className={`priority-badge priority-${complaint.priority?.toLowerCase()}`}>
                        {complaint.priority || 'PENDING'}
                      </span>
                      <span className="complaint-time">
                        {complaint.createdAt?.toLocaleDateString() || 'Just now'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-complaints">
                <p>No complaints submitted yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="quick-actions">
          <h2 className="section-title">Quick Actions</h2>
          <div className="actions-grid">
            <button 
              className="action-btn"
              onClick={() => navigate('/admin/manage-complaints')}
            >
              <span className="action-icon">🔧</span>
              Manage All Complaints
            </button>
            <button 
              className="action-btn"
              onClick={() => navigate('/admin/reports')}
            >
              <span className="action-icon">📊</span>
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
