import React, { useEffect, useState } from 'react';
import { db } from "../../services/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import AdminMagicBento from './AdminMagicBento';
import CountUp from './CountUp';
import "./AdminComponents.css";

function ReportsAndAnalytics() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "complaints"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, snap => {
      const allComplaints = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComplaints(allComplaints);
      setLoading(false);
    });

    return () => unsub();
  }, []);
  
  if (loading) {
    return (
      <div className="reports-analytics">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Loading Analytics...</h2>
        </div>
      </div>
    );
  }

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === "submitted" || c.status === "analyzed").length,
    inProgress: complaints.filter(c => c.status === "in_progress").length,
    resolved: complaints.filter(c => c.status === "resolved").length,
    critical: complaints.filter(c => c.priority === "CRITICAL").length,
    high: complaints.filter(c => c.priority === "HIGH").length,
    byCategory: complaints.reduce((acc, c) => {
      acc[c.category] = (acc[c.category] || 0) + 1;
      return acc;
    }, {}),
    byPriority: complaints.reduce((acc, c) => {
      acc[c.priority] = (acc[c.priority] || 0) + 1;
      return acc;
    }, {})
  };

  const analyticsCards = [
    {
      title: "Total Complaints",
      value: stats.total,
      icon: "📊",
      gradient: "linear-gradient(135deg, #667eea, #764ba2)",
      description: "All time complaints"
    },
    {
      title: "Resolution Rate",
      value: stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0,
      icon: "🎯",
      gradient: "linear-gradient(135deg, #f093fb, #f5576c)",
      description: "% of resolved complaints"
    },
    {
      title: "Critical Issues",
      value: stats.critical,
      icon: "🚨",
      gradient: "linear-gradient(135deg, #ff9a9e, #fecfef)",
      description: "Urgent attention needed"
    },
    {
      title: "Avg Response Time",
      value: "2.4",
      icon: "⏱️",
      gradient: "linear-gradient(135deg, #a8edea, #fed6e3)",
      description: "Hours to first response"
    }
  ];

  const categoryData = Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1]);
  const priorityData = Object.entries(stats.byPriority).sort((a, b) => b[1] - a[1]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "CRITICAL": return "#dc2626";
      case "HIGH": return "#ea580c";
      case "MEDIUM": return "#d97706";
      case "LOW": return "#16a34a";
      default: return "#6b7280";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case "road": return "🚗";
      case "water": return "💧";
      case "electricity": return "⚡";
      case "garbage": return "🗑️";
      default: return "📝";
    }
  };

  return (
    <div className="reports-analytics">
      <div className="page-header">
        <h1 className="page-title">Reports & Analytics</h1>
        <p className="page-subtitle">
          Comprehensive insights and performance metrics
        </p>
      </div>

      <AdminMagicBento 
        cards={analyticsCards}
        enableStars={true}
        glowColor="102, 126, 234"
      />

      <div className="analytics-grid">
        <div className="analytics-card">
          <div className="card-header">
            <h3 className="card-title">📊 Complaint Status Breakdown</h3>
          </div>
          <div className="status-stats">
            <div className="status-item">
              <div className="status-info">
                <span className="status-label">Pending Review</span>
                <span className="status-description">Awaiting admin action</span>
              </div>
              <div className="status-value pending">
                <CountUp from={0} to={stats.pending} duration={1} />
              </div>
            </div>
            <div className="status-item">
              <div className="status-info">
                <span className="status-label">In Progress</span>
                <span className="status-description">Being worked on</span>
              </div>
              <div className="status-value in-progress">
                <CountUp from={0} to={stats.inProgress} duration={1.2} />
              </div>
            </div>
            <div className="status-item">
              <div className="status-info">
                <span className="status-label">Resolved</span>
                <span className="status-description">Successfully completed</span>
              </div>
              <div className="status-value resolved">
                <CountUp from={0} to={stats.resolved} duration={1.4} />
              </div>
            </div>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-header">
            <h3 className="card-title">📊 Complaints by Category</h3>
          </div>
          <div className="category-stats">
            {categoryData.map(([category, count], index) => (
              <div key={category} className="category-item">
                <div className="category-info">
                  <span className="category-icon">{getCategoryIcon(category)}</span>
                  <span className="category-label">{category}</span>
                </div>
                <div className="category-value">
                  <CountUp from={0} to={count} duration={1 + index * 0.1} />
                </div>
                <div className="category-bar">
                  <div 
                    className="category-fill"
                    style={{ 
                      width: `${(count / Math.max(...categoryData.map(([,c]) => c))) * 100}%`,
                      background: `linear-gradient(90deg, #4285F4, #34A853)`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-header">
            <h3 className="card-title">🚨 Priority Distribution</h3>
          </div>
          <div className="priority-stats">
            {priorityData.map(([priority, count], index) => (
              <div key={priority} className="priority-item">
                <div className="priority-info">
                  <span 
                    className="priority-dot"
                    style={{ backgroundColor: getPriorityColor(priority) }}
                  ></span>
                  <span className="priority-label">{priority || 'PENDING'}</span>
                </div>
                <div className="priority-value">
                  <CountUp from={0} to={count} duration={1 + index * 0.1} />
                </div>
                <div className="priority-percentage">
                  {stats.total > 0 ? Math.round((count / stats.total) * 100) : 0}%
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-card performance-card">
          <div className="card-header">
            <h3 className="card-title">🚀 Performance Metrics</h3>
          </div>
          <div className="performance-stats">
            <div className="metric-item">
              <div className="metric-icon">⏱️</div>
              <div className="metric-info">
                <div className="metric-label">Avg Response Time</div>
                <div className="metric-value">2.4 hours</div>
              </div>
            </div>
            <div className="metric-item">
              <div className="metric-icon">🎯</div>
              <div className="metric-info">
                <div className="metric-label">Resolution Rate</div>
                <div className="metric-value">
                  <CountUp 
                    from={0} 
                    to={stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0} 
                    duration={2} 
                  />%
                </div>
              </div>
            </div>
            <div className="metric-item">
              <div className="metric-icon">📈</div>
              <div className="metric-info">
                <div className="metric-label">Satisfaction Score</div>
                <div className="metric-value">4.2/5.0</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsAndAnalytics;
