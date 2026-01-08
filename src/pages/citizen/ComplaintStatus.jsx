import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../services/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import "./ComplaintStatus.css";

const ComplaintStatus = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    // Simple query without orderBy to avoid index requirement
    const q = query(
      collection(db, "complaints"),
      where("userId", "==", user.uid)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userComplaints = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
      
      // Sort in JavaScript instead of Firestore
      userComplaints.sort((a, b) => b.createdAt - a.createdAt);
      
      console.log("📋 Real-time complaints update:", userComplaints.length);
      setComplaints(userComplaints);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching complaints:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "#f59e0b";
      case "in_progress": return "#3b82f6";
      case "resolved": return "#059669";
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

  if (!user) {
    return (
      <div className="status-wrapper">
        <h2>Please log in to view your complaints</h2>
      </div>
    );
  }

  return (
    <div className="status-wrapper">
      <h2 className="status-title">My Complaints</h2>

      {complaints.length === 0 ? (
        <div className="no-complaints">
          <p>No complaints submitted yet.</p>
          <button onClick={() => window.location.href = '/citizen/raise-complaint'}>
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
                </div>
              </div>

              <div className="complaint-content">
                <p className="description">{complaint.description}</p>
                
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
              </div>

              <div className="complaint-footer">
                <div className="timestamps">
                  <p className="submitted-time">
                    <strong>Submitted:</strong> {new Date(complaint.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComplaintStatus;
