import React, { useState, useEffect } from "react";
import { db } from "../../services/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "complaints"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, snap => {
      setComplaints(
        snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      );
    });

    return () => unsub();
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "CRITICAL": return "#ff4444";
      case "HIGH": return "#ff8800";
      case "MEDIUM": return "#ffaa00";
      case "LOW": return "#00aa00";
      default: return "#666";
    }
  };

  return (
    <div style={{ padding: "20px", color: "#fff" }}>
      <h2>Admin - Complaint Management</h2>
      
      <div style={{ display: "grid", gap: "15px" }}>
        {complaints.map(complaint => (
          <div 
            key={complaint.id} 
            style={{
              background: "#1a1a1a",
              padding: "20px",
              borderRadius: "8px",
              border: `2px solid ${getPriorityColor(complaint.priority)}`
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h4>{complaint.category}</h4>
              <span 
                style={{
                  background: getPriorityColor(complaint.priority),
                  color: "#fff",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "12px"
                }}
              >
                {complaint.priority || "PENDING"}
              </span>
            </div>
            
            <p><strong>Description:</strong> {complaint.description}</p>
            
            {complaint.aiAnalysis && (
              <p><strong>AI Analysis:</strong> {complaint.aiAnalysis}</p>
            )}
            
            <div style={{ display: "flex", gap: "20px", fontSize: "14px", color: "#aaa" }}>
              <span>Status: {complaint.status}</span>
              <span>User: {complaint.userId}</span>
              <span>
                Submitted: {complaint.createdAt?.toDate?.()?.toLocaleString()}
              </span>
              {complaint.analyzedAt && (
                <span>
                  Analyzed: {complaint.analyzedAt?.toDate?.()?.toLocaleString()}
                </span>
              )}
            </div>
            
            {complaint.location && (
              <p style={{ fontSize: "14px", color: "#aaa" }}>
                Location: {complaint.location.lat}, {complaint.location.lng}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminComplaints;