import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [screenTime, setScreenTime] = useState(0);
  const [activeTab, setActiveTab] = useState('Dashboard'); // Default to "Dashboard"

  // Screen time tracking logic
  useEffect(() => {
    const startTime = localStorage.getItem('startTime');
    const savedScreenTime = localStorage.getItem('screenTime') || 0;

    if (!startTime) {
      localStorage.setItem('startTime', Date.now());
    }

    const handleUnload = () => {
      const endTime = Date.now();
      const elapsedTime = endTime - parseInt(localStorage.getItem('startTime'), 10);
      const totalScreenTime = parseInt(savedScreenTime, 10) + elapsedTime;
      localStorage.setItem('screenTime', totalScreenTime);
      localStorage.removeItem('startTime');
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  // Update screen time display
  useEffect(() => {
    const interval = setInterval(() => {
      const savedScreenTime = localStorage.getItem('screenTime') || 0;
      const startTime = localStorage.getItem('startTime');
      if (startTime) {
        const elapsedTime = Date.now() - parseInt(startTime, 10);
        const totalScreenTime = parseInt(savedScreenTime, 10) + elapsedTime;
        setScreenTime(totalScreenTime);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Logout handler with timer reset
  const handleLogout = () => {
    localStorage.removeItem('startTime');
    localStorage.removeItem('screenTime');
    logout();
    navigate('/');
  };

  const handleCompleteProfile = () => {
    navigate('/profile-setup');
  };

  // Modified to correctly map nav items to routes
  const navItems = [
    { name: 'Dashboard', route: '/dashboard' },
    { name: 'Student Corner', route: '/student-corner' },
    { name: 'Resources', route: '/resources' },
    { name: 'Mentor Interface', route: '/mentor-interface' }
  ];

  const handleNavClick = (route, tabName) => {
    setActiveTab(tabName); // Set the active tab
    navigate(route); // Navigate to the route
  };

  const formatScreenTime = (time) => {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="auth-page">
      <div className="dashboard-container">
        {/* Left Sidebar */}
        <div className="sidebar">
          <h2 className="gradient-text title-text">AutomateX</h2>

          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <button
                key={item.name}
                className={`nav-item ${activeTab === item.name ? 'nav-item-active' : ''}`}
                onClick={() => handleNavClick(item.route, item.name)}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="sidebar-footer">
            <button onClick={handleLogout} className="btn-logout">
              Log Out
            </button>
          </div>

          <div className="help-section">
            <div className="help-card">
              <h3 className="help-title">Need Assistance?</h3>
              <p className="help-text">Contact your mentor or reach out to support.</p>
              <button className="help-button">Get Help</button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <header className="dashboard-header">
            <h1>Welcome, {user?.name || 'User'}</h1>
            <div className="user-profile">
              <div className="user-avatar">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" />
                ) : (
                  <div className="avatar-placeholder">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className="dashboard-content">
            {user && !user.profileCompleted && (
              <div className="profile-reminder">
                <h3>Complete Your Profile</h3>
                <p>Finish setting up your profile to get the most out of our platform.</p>
                <button onClick={handleCompleteProfile} className="btn btn-primary">
  Complete Profile
</button>
              </div>
            )}

            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h3>Quick Start</h3>
                <p>Get started with our platform by exploring these features.</p>
                <ul className="feature-list">
                  <li>Create your first project</li>
                  <li>Connect with team members</li>
                  <li>Explore templates</li>
                </ul>
              </div>

              <div className="dashboard-card">
                <h3>Recent Activity</h3>
                <p>You haven't performed any actions yet.</p>
              </div>

              <div className="dashboard-card">
                <h3>Resources</h3>
                <ul className="resource-list">
                  <li>Documentation</li>
                  <li>Tutorials</li>
                  <li>Community Forum</li>
                </ul>
              </div>
            </div>
          </main>

          {/* Screen time display in the bottom-right corner */}
          <div className="screen-time-display">
            <p>Screen Time: {formatScreenTime(screenTime)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;