import React, { useEffect, useState, useContext } from "react";
import { getDashboardStats } from "../../services/dashboardService";
import { AuthContext } from "../../context/AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await getDashboardStats();
      setStats(res.stats);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        setError("Access denied: You do not have permission to view this dashboard.");
      } else {
        setError("Failed to load dashboard stats. Please refresh or contact support.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="alert alert-danger shadow-sm border-0 rounded-4 p-4">
          <h4 className="alert-heading font-weight-bold">Error Encountered</h4>
          <p className="mb-0">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Top Banner Section */}
      <section className="dashboard-banner">
        <div>
          <span className="dashboard-eyebrow">Support Network Insights</span>
          <h1>Welcome back, {user?.name || "Support Member"}</h1>
          <p className="dashboard-subtitle">
            Track community growth, resource impact, and active alerts in real-time.
          </p>
        </div>
        <div className="dashboard-pill">
          {user?.role?.toUpperCase() || "MEMBER"}
        </div>
      </section>

      {/* Stats Grid Section */}
      <section className="stats-grid">
        {loading ? (
          // Skeleton loader state while fetching data
          Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="skeleton-card" />
          ))
        ) : (
          <>
            <div className="dashboard-card">
              <span className="stat-label">Total Users</span>
              <span className="stat-value">{stats?.totalUsers?.toLocaleString() || 0}</span>
            </div>
            <div className="dashboard-card">
              <span className="stat-label">Approved Users</span>
              <span className="stat-value">{stats?.approvedUsers?.toLocaleString() || 0}</span>
            </div>
            <div className="dashboard-card">
              <span className="stat-label">Pending Approvals</span>
              <span className="stat-value">{stats?.pendingUsers?.toLocaleString() || 0}</span>
            </div>
            <div className="dashboard-card">
              <span className="stat-label">Communities</span>
              <span className="stat-value">{stats?.totalCommunities?.toLocaleString() || 0}</span>
            </div>
            <div className="dashboard-card">
              <span className="stat-label">Forum Posts</span>
              <span className="stat-value">{stats?.totalForums?.toLocaleString() || 0}</span>
            </div>
            <div className="dashboard-card">
              <span className="stat-label">Resources</span>
              <span className="stat-value">{stats?.totalResources?.toLocaleString() || 0}</span>
            </div>
            <div className="dashboard-card dashboard-card-accent">
              <span className="stat-label">Active Alerts</span>
              <span className="stat-value">{stats?.activeAlerts?.toLocaleString() || 0}</span>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Dashboard;