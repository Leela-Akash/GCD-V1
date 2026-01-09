import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../services/firebase";
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from "firebase/firestore";
import "./AdminComponents.css";

export default function ManageComplaints() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "complaints"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, snap => {
      const allComplaints = snap.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
      setComplaints(allComplaints);
      setLoading(false);
      console.log('📋 Real-time manage complaints update:', allComplaints.length);
    });

    return () => unsub();
  }, []);

  const handleBack = () => {
    navigate("/admin/dashboard");
  };

  const updateComplaintStatus = async (complaintId, newStatus) => {
    try {
      await updateDoc(doc(db, "complaints", complaintId), {
        status: newStatus,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error("Error updating complaint:", error);
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesFilter = filter === 'all' || 
      (filter === 'high' && (complaint.priority === 'HIGH' || complaint.priority === 'CRITICAL')) ||
      (filter === 'pending' && (complaint.status === 'submitted' || complaint.status === 'analyzed')) ||
      (filter === 'resolved' && complaint.status === 'resolved');
    
    const matchesSearch = !search || 
      complaint.description.toLowerCase().includes(search.toLowerCase()) ||
      complaint.category.toLowerCase().includes(search.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "CRITICAL": return "#dc2626";
      case "HIGH": return "#ea580c";
      case "MEDIUM": return "#d97706";
      case "LOW": return "#16a34a";
      default: return "#6b7280";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "submitted": return "#f59e0b";
      case "analyzed": return "#10b981";
      case "in_progress": return "#3b82f6";
      case "resolved": return "#059669";
      default: return "#6b7280";
    }
  };

  if (loading) {
    return (
      <div className="manage-complaints">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Loading Complaints...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-complaints">
      <div className="header-container">
        <button className="back-button" onClick={handleBack}>
          ← Back to Dashboard
        </button>
        
        <div className="header-center">
          <h1 className="page-title">Manage Complaints</h1>
          <p className="page-subtitle">Review and manage all citizen complaints</p>
        </div>
        
        <div className="live-indicator">
          <span className="live-dot"></span>
          Live Updates
        </div>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search complaints..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({complaints.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'high' ? 'active' : ''}`}
            onClick={() => setFilter('high')}
          >
            High Priority
          </button>
          <button 
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={`filter-btn ${filter === 'resolved' ? 'active' : ''}`}
            onClick={() => setFilter('resolved')}
          >
            Resolved
          </button>
        </div>
      </div>

      <div className="complaints-container">
        {filteredComplaints.length === 0 ? (
          <div className="no-complaints">
            <h3>No complaints found</h3>
            <p>No complaints match the current filter.</p>
          </div>
        ) : (
          <div className="complaints-grid">
            {filteredComplaints.map(complaint => (
              <div key={complaint.id} className="complaint-card">
                <div className="complaint-header">
                  <div className="complaint-category">{complaint.category}</div>
                  <div className="complaint-badges">
                    <span 
                      className="priority-badge"
                      style={{ backgroundColor: getPriorityColor(complaint.priority) }}
                    >
                      {complaint.priority || 'PENDING'}
                    </span>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(complaint.status) }}
                    >
                      {complaint.status?.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="complaint-content">
                  <p className="complaint-description">{complaint.description}</p>
                  
                  {complaint.location && (
                    <div className="complaint-location">
                      <span className="location-icon">📍</span>
                      <a 
                        href={`https://www.google.com/maps?q=${complaint.location.lat},${complaint.location.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="location-link"
                      >
                        View Location
                      </a>
                    </div>
                  )}

                  {complaint.aiAnalysis && (
                    <div className="ai-analysis">
                      <strong>🤖 AI Analysis:</strong>
                      <p>{complaint.aiAnalysis}</p>
                    </div>
                  )}
                </div>

                <div className="complaint-footer">
                  <div className="complaint-meta">
                    <span className="complaint-date">
                      {complaint.createdAt?.toDate?.()?.toLocaleDateString() || 'Just now'}
                    </span>
                  </div>
                  
                  <div className="complaint-actions">
                    {complaint.status !== 'resolved' && (
                      <>
                        <button 
                          className="action-btn progress-btn"
                          onClick={() => updateComplaintStatus(complaint.id, 'in_progress')}
                        >
                          In Progress
                        </button>
                        <button 
                          className="action-btn resolve-btn"
                          onClick={() => updateComplaintStatus(complaint.id, 'resolved')}
                        >
                          Resolve
                        </button>
                      </>
                    )}
                    {complaint.status === 'resolved' && (
                      <button 
                        className="action-btn reopen-btn"
                        onClick={() => updateComplaintStatus(complaint.id, 'analyzed')}
                      >
                        Reopen
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}