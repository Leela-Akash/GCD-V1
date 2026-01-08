import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useNavigate } from 'react-router-dom';
import './AdminComplaints.css';

export default function PendingComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(
      collection(db, 'complaints'),
      where('status', 'in', ['pending', 'submitted', 'analyzed']),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const complaintsData = [];
      snapshot.forEach((doc) => {
        complaintsData.push({ id: doc.id, ...doc.data() });
      });
      setComplaints(complaintsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="admin-complaints-page">
        <div className="loading">Loading pending complaints...</div>
      </div>
    );
  }

  return (
    <div className="admin-complaints-page">
      <div className="complaints-header">
        <button className="back-btn" onClick={() => navigate('/admin/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>⏳ Pending Complaints ({complaints.length})</h1>
      </div>

      {complaints.length === 0 ? (
        <div className="empty-state">
          <h3>No Pending Complaints</h3>
          <p>All complaints have been processed or resolved.</p>
        </div>
      ) : (
        <div className="complaints-grid">
          {complaints.map((complaint) => (
            <div key={complaint.id} className={`complaint-card status-${complaint.status}`}>
              <div className="complaint-header">
                <span className={`priority-badge ${complaint.priority?.toLowerCase()}`}>
                  {complaint.priority || 'MEDIUM'}
                </span>
                <span className="complaint-date">
                  {complaint.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown date'}
                </span>
              </div>
              
              <div className="complaint-content">
                <h4>{complaint.category}</h4>
                <p>{complaint.description}</p>
                
                {complaint.location && (
                  <div className="location">
                    📍 Lat: {complaint.location.lat}, Lng: {complaint.location.lng}
                  </div>
                )}
                
                {complaint.aiAnalysis && (
                  <div className="ai-analysis">
                    <strong>AI Analysis:</strong>
                    <p>{complaint.aiAnalysis}</p>
                  </div>
                )}
              </div>
              
              <div className="complaint-footer">
                <span className={`status-badge ${complaint.status}`}>
                  {complaint.status}
                </span>
                <span className="user-id">User: {complaint.userId}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
