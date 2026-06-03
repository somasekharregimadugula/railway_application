
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
   
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setUserProfile(response.data.user);
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Token might be invalid or expired
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner-large"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <nav className="dashboard-sidebar">
        <div className="sidebar-logo">
          🚂 <span>IRCTC</span>
        </div>
        <ul className="sidebar-menu">
          <li className="active"><span className="icon">🏠</span> Dashboard</li>
          <li><span className="icon">🎟️</span> Book Ticket</li>
          <li><span className="icon">📋</span> My Bookings</li>
          <li><span className="icon">👤</span> Profile</li>
        </ul>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <span className="icon">🚪</span> Logout
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-search">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Search trains, stations..." />
          </div>
          <div className="header-profile">
            <div className="notification-bell">🔔<span className="badge">3</span></div>
            <div className="user-avatar">
               {userProfile?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <span className="user-name">{userProfile?.username}</span>
              <span className="user-role">{userProfile?.role}</span>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <div className="welcome-section">
            <h1>Welcome back, <span className="highlight">{userProfile?.username}</span>! 👋</h1>
            <p>Ready to plan your next journey?</p>
          </div>

          {/* Quick Actions Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon upcoming">🎟️</div>
              <div className="stat-details">
                <h3>Upcoming Journeys</h3>
                <p className="stat-value">2</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon completed">✅</div>
              <div className="stat-details">
                <h3>Completed Trips</h3>
                <p className="stat-value">12</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon pnr">📋</div>
              <div className="stat-details">
                <h3>Check PNR Status</h3>
                <p className="stat-value">Active</p>
              </div>
            </div>
          </div>

          {/* Booking Widget (Mock) */}
          <div className="booking-widget">
            <h2>Book a Ticket</h2>
            <div className="booking-form-mock">
               <div className="input-row">
                 <div className="input-group-dash">
                   <label>From</label>
                   <input type="text" placeholder="NDLS - New Delhi" />
                 </div>
                 <div className="swap-icon">⇌</div>
                 <div className="input-group-dash">
                   <label>To</label>
                   <input type="text" placeholder="MMCT - Mumbai Central" />
                 </div>
               </div>
               <div className="input-row">
                 <div className="input-group-dash">
                   <label>Date</label>
                   <input type="date" />
                 </div>
                 <div className="input-group-dash">
                   <label>Class</label>
                   <select>
                     <option>All Classes</option>
                     <option>Sleeper (SL)</option>
                     <option>AC 3 Tier (3A)</option>
                     <option>AC 2 Tier (2A)</option>
                   </select>
                 </div>
                 <button className="search-trains-btn">Search Trains</button>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
