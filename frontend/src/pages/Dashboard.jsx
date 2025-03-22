import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [screenTime, setScreenTime] = useState(0);
  const [activeTab, setActiveTab] = useState('Dashboard'); // Default to "Dashboard"
  const [showAssistant, setShowAssistant] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState([]);

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

  // Toggle assistant visibility
  const toggleAssistant = () => {
    setShowAssistant(!showAssistant);
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (userMessage.trim() === '') return;
    
    // Add user message to chat
    const newMessage = {
      sender: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };
    
    setMessages([...messages, newMessage]);
    
    // Simple AI response simulation
    setTimeout(() => {
      const aiResponse = {
        sender: 'assistant',
        content: `I received your message: "${userMessage}"`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
    
    setUserMessage('');
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Add a message indicating file upload
      const fileMessage = {
        sender: 'user',
        content: `Uploaded file: ${file.name}`,
        timestamp: new Date().toISOString()
      };
      setMessages([...messages, fileMessage]);
      
      // Response simulation
      setTimeout(() => {
        const aiResponse = {
          sender: 'assistant',
          content: `I've received your file: ${file.name}. I can help you analyze this document.`,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  // Enter key to send message
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
      
      {/* AI Assistant Icon */}
      <button 
        className={`ai-assistant-button ${showAssistant ? 'active' : ''}`}
        onClick={toggleAssistant}
        aria-label="AI Assistant"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
        </svg>
      </button>
      
      {/* AI Assistant Panel */}
      {showAssistant && (
        <div className="ai-assistant-panel">
          <div className="assistant-header">
            <h2 className="gradient-text">AI Assistant</h2>
            <button className="close-assistant" onClick={toggleAssistant}>×</button>
          </div>
          
          <div className="assistant-messages">
            {messages.length === 0 ? (
              <div className="welcome-message">
                <h3>Hello, I'm your AI assistant</h3>
                <p>How can I help you today? You can ask me questions or upload documents for analysis.</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender === 'user' ? 'user-message' : 'assistant-message'}`}>
                  <div className="message-content">{msg.content}</div>
                </div>
              ))
            )}
          </div>
          
          <div className="assistant-input">
            <label htmlFor="file-upload" className="upload-button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
              </svg>
            </label>
            <input 
              type="file" 
              id="file-upload" 
              onChange={handleFileUpload} 
              style={{ display: 'none' }}
              accept=".pdf,.doc,.docx,.txt"
            />
            
            <textarea
              className="message-input"
              placeholder="Type your message here..."
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            ></textarea>
            
            <button 
              className="send-button"
              onClick={handleSendMessage}
              disabled={!userMessage.trim()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;