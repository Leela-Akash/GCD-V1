import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { auth } from "../../services/firebase";
import "./ComplaintStatus.css";

const ComplaintStatus = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For demo purposes, show all complaints for now
    // In real app, filter by actual user ID
    
    const q = query(
      collection(db, "complaints"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, snap => {
      const allComplaints = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("📋 Found complaints:", allComplaints);
      setComplaints(allComplaints);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "submitted": return "#f59e0b";
      case "analyzed": return "#10b981";
      case "in_progress": return "#3b82f6";
      case "resolved": return "#059669";
      case "analysis_failed": return "#ef4444";
      default: return "#6b7280";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "CRITICAL": return "#dc2626";
      case "HIGH": return "#ea580c";
      case "MEDIUM": return "#d97706";
      case "LOW": return "#16a34a";
      default: return "#6b7280";
    }
  };

  if (loading) {
    return (
      <div className="status-wrapper">
        <h2>Loading your complaints...</h2>
      </div>
    );
  }

  return (
    <div className="status-wrapper">
      <h2 className="status-title">My Complaints</h2>

      {complaints.length === 0 ? (
        <div className="no-complaints">
          <p>No complaints submitted yet.</p>
          <button onClick={() => window.location.href = '/raise-complaint'}>
            Submit Your First Complaint
          </button>
        </div>
      ) : (
        <div className="complaints-grid">
          {complaints.map(complaint => (
            <div key={complaint.id} className="complaint-card">
              <div className="complaint-header">
                <h3>{complaint.category}</h3>
                <div className="status-badges">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(complaint.status) }}
                  >
                    {complaint.status.replace('_', ' ').toUpperCase()}
                  </span>
                  {complaint.priority && complaint.priority !== "pending" && (
                    <span 
                      className="priority-badge"
                      style={{ backgroundColor: getPriorityColor(complaint.priority) }}
                    >
                      {complaint.priority}
                    </span>
                  )}
                </div>
              </div>

              <div className="complaint-content">
                <p className="description">{complaint.originalDescription || complaint.description}</p>
                
                {complaint.customCategory && (
                  <p className="custom-category">
                    <strong>Specific Issue:</strong> {complaint.customCategory}
                  </p>
                )}

                {complaint.location && (
                  <p className="location">
                    <strong>📍 Location:</strong> 
                    <a 
                      href={`https://www.google.com/maps?q=${complaint.location.lat},${complaint.location.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#3b82f6', textDecoration: 'underline', marginLeft: '5px' }}
                    >
                      {complaint.location.lat.toFixed(4)}, {complaint.location.lng.toFixed(4)}
                    </a>
                  </p>
                )}

                {complaint.hasAudio && (
                  <p className="audio-indicator">
                    🎙️ Voice recording included
                  </p>
                )}

                {complaint.media && complaint.media.length > 0 && (
                  <p className="media-indicator">
                    📎 {complaint.media.length} file(s) attached
                  </p>
                )}
              </div>

              <div className="complaint-footer">
                <div className="timestamps">
                  <p className="submitted-time">
                    <strong>Submitted:</strong> {complaint.createdAt?.toDate?.()?.toLocaleString() || 'Just now'}
                  </p>
                  {complaint.analyzedAt && (
                    <p className="analyzed-time">
                      <strong>Analyzed:</strong> {complaint.analyzedAt?.toDate?.()?.toLocaleString()}
                    </p>
                  )}
                </div>
                
                {complaint.hasMediaAnalysis && complaint.mediaAnalysis && (
                  <div className="media-analysis">
                    <strong>🖼️ Image Analysis:</strong>
                    <p>{complaint.mediaAnalysis}</p>
                  </div>
                )}
                
                {complaint.status === "analyzed" && complaint.aiAnalysis && (
                  <div className="ai-insight">
                    <strong>💡 AI Insight:</strong>
                    <p>{complaint.aiAnalysis}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComplaintStatus;
