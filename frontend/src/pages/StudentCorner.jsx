import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/StudentCorner.css';

const StudentCorner = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Student Corner');

  // Sample data for student analytics
  const studentData = {
    hoursStudied: 128,
    conceptsLearnt: 42,
    coursesCompleted: 7,
    quizzesTaken: 15,
    averageScore: 82,
  };

  // Sample quiz attempt data
  const quizAttempts = [
    { id: 1, name: 'Data Structures Basics', score: 85, date: '2025-03-18', duration: '45 min' },
    { id: 2, name: 'Algorithm Complexity', score: 92, date: '2025-03-15', duration: '60 min' },
    { id: 3, name: 'Intro to Machine Learning', score: 78, date: '2025-03-10', duration: '50 min' },
    { id: 4, name: 'Web Development Fundamentals', score: 88, date: '2025-03-05', duration: '40 min' },
    { id: 5, name: 'Python Advanced Concepts', score: 76, date: '2025-02-28', duration: '55 min' },
  ];

  // Sample daily concepts
  const dailyConcepts = [
    { id: 1, title: 'Binary Search Trees', difficulty: 'Intermediate', estimatedTime: '45 min' },
    { id: 2, title: 'HTTP Protocols', difficulty: 'Beginner', estimatedTime: '30 min' },
    { id: 3, title: 'React Hooks', difficulty: 'Intermediate', estimatedTime: '60 min' },
    { id: 4, title: 'Database Indexing', difficulty: 'Advanced', estimatedTime: '50 min' },
    { id: 5, title: 'CSS Grid Layout', difficulty: 'Beginner', estimatedTime: '25 min' },
  ];

  // Function to get color based on score
  const getScoreColor = (score) => {
    if (score >= 80) return { bg: 'rgba(46, 213, 115, 0.2)', text: '#2ed573' };
    if (score >= 70) return { bg: 'rgba(255, 127, 80, 0.2)', text: '#ff7f50' };
    return { bg: 'rgba(255, 71, 87, 0.2)', text: '#ff4757' };
  };

  // Function to get color based on difficulty
  const getDifficultyColor = (difficulty) => {
    if (difficulty === 'Beginner') return '#89a5df';
    if (difficulty === 'Intermediate') return '#e8e191';
    return '#e46e7f';
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Handle navigation
  const handleNavClick = (route, tabName) => {
    setActiveTab(tabName);
    navigate(route);
  };

  // Handle profile completion
  const handleCompleteProfile = () => {
    navigate('/profile-setup');
  };

  return (
    <div className="auth-page">
      <div className="dashboard-container">
        {/* Left Sidebar */}
        <div className="sidebar">
          <h2 className="gradient-text title-text">AutomateX</h2>

          <nav className="sidebar-nav">
            {['Dashboard', 'Student Corner', 'Resources', 'Mentor Interface'].map((item) => (
              <button
                key={item}
                className={`nav-item ${activeTab === item ? 'nav-item-active' : ''}`}
                onClick={() => handleNavClick(`/${item.toLowerCase().replace(' ', '-')}`, item)}
              >
                {item}
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
          <h1 className="gradient-text title-text">Student Corner</h1>

          {/* Profile Check - Show content only if profile is completed */}
          {user && !user.profileCompleted ? (
            <div className="profile-incomplete-container">
              <div className="profile-incomplete-card">
                <div className="profile-incomplete-icon">🔒</div>
                <h2>Profile Incomplete</h2>
                <p>Please complete your profile setup to access the Student Corner features.</p>
                <button onClick={handleCompleteProfile} className="btn-primary">
                  Complete Your Profile
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="stats-grid">
                {[
                  { label: 'Hours Studied', value: studentData.hoursStudied, icon: '⏱️' },
                  { label: 'Concepts Learnt', value: studentData.conceptsLearnt, icon: '📚' },
                  { label: 'Courses Completed', value: studentData.coursesCompleted, icon: '🎓' },
                  { label: 'Avg. Quiz Score', value: `${studentData.averageScore}%`, icon: '📊' },
                ].map((stat, idx) => (
                  <div key={idx} className="stat-card">
                    <div className="stat-content">
                      <div>
                        <p className="stat-label">{stat.label}</p>
                        <p className="stat-value">{stat.value}</p>
                      </div>
                      <span className="stat-icon">{stat.icon}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quiz Attempts */}
              <div className="quiz-section">
                <h2 className="section-title">Recent Quiz Attempts</h2>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th className="text-left">Quiz Name</th>
                        <th className="text-center">Score</th>
                        <th className="text-center">Date</th>
                        <th className="text-center">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quizAttempts.map((quiz) => {
                        const scoreColor = getScoreColor(quiz.score);
                        return (
                          <tr key={quiz.id}>
                            <td>{quiz.name}</td>
                            <td className="text-center">
                              <span
                                className="score-badge"
                                style={{
                                  backgroundColor: scoreColor.bg,
                                  color: scoreColor.text,
                                }}
                              >
                                {quiz.score}%
                              </span>
                            </td>
                            <td className="text-center">{quiz.date}</td>
                            <td className="text-center">{quiz.duration}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="view-all-container">
                  <button className="btn-primary">View All Quizzes</button>
                </div>
              </div>

              {/* Performance Chart - Placeholder */}
              <div className="chart-container">
                <h2 className="section-title">Performance Overview</h2>
                <div className="chart-placeholder">
                  <p>Performance chart visualization would appear here</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Panel - Daily Concepts - Only display if profile is completed */}
        <div className="right-panel">
          {user && !user.profileCompleted ? (
            <div className="profile-incomplete-hint">
              <h3>Unlock All Features</h3>
              <p>Complete your profile to access personalized learning resources and track your progress.</p>
            </div>
          ) : (
            <>
              <h2 className="section-title">Daily Concepts</h2>

              <div className="concepts-container">
                {dailyConcepts.map((concept) => (
                  <div key={concept.id} className="concept-card">
                    <h3 className="concept-title">{concept.title}</h3>
                    <div className="concept-meta">
                      <span style={{ color: getDifficultyColor(concept.difficulty) }}>
                        {concept.difficulty}
                      </span>
                      <span className="concept-time">{concept.estimatedTime}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="view-all-concepts">
                <button className="btn-secondary">View All Concepts</button>
              </div>

              <div className="weekly-progress">
                <h3 className="progress-title">Weekly Progress</h3>
                <div className="progress-container">
                  {[
                    { label: 'Study Goal', current: 16, max: 20, unit: 'hrs', color: '#89a5df' },
                    { label: 'Concepts', current: 12, max: 15, unit: '', color: '#e8e191' },
                    { label: 'Quiz Score', current: 82, max: 100, unit: '%', color: '#e46e7f' },
                  ].map((progress, idx) => (
                    <div key={idx} className="progress-item">
                      <div className="progress-header">
                        <span>{progress.label}</span>
                        <span>
                          {progress.current}/{progress.max} {progress.unit}
                        </span>
                      </div>
                      <div className="progress-bar-bg">
                        <div
                          className="progress-bar-fill"
                          style={{
                            width: `${(progress.current / progress.max) * 100}%`,
                            backgroundColor: progress.color,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentCorner;