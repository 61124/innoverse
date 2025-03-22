import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/MentorInterface.css';

const MentorInterface = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('Mentor Interface');
  const [showGraphs, setShowGraphs] = useState(false);
  const navigate = useNavigate();

  // Sample data for statistics
  const statsData = {
    totalHours: 215,
    totalRevisits: 87,
    averageScore: 79,
    performanceScore: 83
  };

  // Sample data for hours per subject
  const subjectHours = [
    { subject: 'Data Structures', hours: 42 },
    { subject: 'Web Development', hours: 56 },
    { subject: 'Machine Learning', hours: 38 },
    { subject: 'Python Programming', hours: 45 },
    { subject: 'Database Systems', hours: 34 }
  ];

  // Sample data for resource revisits
  const resourceRevisits = [
    { resource: 'Algorithm Complexity Guide', revisits: 23 },
    { resource: 'React Hooks Tutorial', revisits: 18 },
    { resource: 'Machine Learning Basics', revisits: 15 },
    { resource: 'SQL Fundamentals', revisits: 14 },
    { resource: 'Data Structures Cheatsheet', revisits: 17 }
  ];

  // Sample quiz performance data
  const quizPerformanceData = [
    { category: 'Algorithms', score: 85 },
    { category: 'Frontend', score: 92 },
    { category: 'Backend', score: 78 },
    { category: 'Databases', score: 73 },
    { category: 'AI & ML', score: 81 }
  ];

  // Function to get color based on score
  const getScoreColor = (score) => {
    if (score >= 80) return { bg: 'rgba(46, 213, 115, 0.2)', text: '#2ed573' };
    if (score >= 70) return { bg: 'rgba(255, 127, 80, 0.2)', text: '#ff7f50' };
    return { bg: 'rgba(255, 71, 87, 0.2)', text: '#ff4757' };
  };

  // Dummy bar chart component
  const BarChart = ({ data, title, valueKey, labelKey, barColor }) => {
    const maxValue = Math.max(...data.map(item => item[valueKey]));

    return (
      <div className="chart-container">
        <h3 className="chart-title">{title}</h3>
        <div className="bar-chart">
          {data.map((item, index) => (
            <div key={index} className="bar-item">
              <div className="bar-label">{item[labelKey]}</div>
              <div className="bar-container">
                <div
                  className="bar-fill"
                  style={{
                    width: `${(item[valueKey] / maxValue) * 100}%`,
                    backgroundColor: barColor || '#89a5df'
                  }}
                ></div>
                <span className="bar-value">{item[valueKey]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Dummy donut chart component
  const DonutChart = ({ data, title }) => {
    const total = data.reduce((sum, item) => sum + item.score, 0);
    let startAngle = 0;

    return (
      <div className="donut-chart-container">
        <h3 className="chart-title">{title}</h3>
        <div className="donut-chart">
          <svg viewBox="0 0 100 100" className="donut">
            {data.map((item, index) => {
              const percentage = (item.score / total) * 100;
              const angle = (percentage / 100) * 360;
              const endAngle = startAngle + angle;

              // Convert angles to radians and calculate x,y coordinates
              const startAngleRad = (startAngle - 90) * (Math.PI / 180);
              const endAngleRad = (endAngle - 90) * (Math.PI / 180);

              const x1 = 50 + 40 * Math.cos(startAngleRad);
              const y1 = 50 + 40 * Math.sin(startAngleRad);
              const x2 = 50 + 40 * Math.cos(endAngleRad);
              const y2 = 50 + 40 * Math.sin(endAngleRad);

              const largeArc = angle > 180 ? 1 : 0;

              // Generate a color based on index
              const colors = ['#89a5df', '#e46e7f', '#e8e191', '#2ed573', '#ff7f50'];
              const color = colors[index % colors.length];

              const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;

              startAngle = endAngle;

              return <path key={index} d={pathData} fill={color} />;
            })}
            <circle cx="50" cy="50" r="25" fill="var(--bg-dark)" />
          </svg>
          <div className="donut-legend">
            {data.map((item, index) => {
              const colors = ['#89a5df', '#e46e7f', '#e8e191', '#2ed573', '#ff7f50'];
              return (
                <div key={index} className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: colors[index % colors.length] }}></span>
                  <span className="legend-label">{item.category}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Dummy line chart for weekly progress
  const LineChart = ({ title }) => {
    return (
      <div className="chart-container">
        <h3 className="chart-title">{title}</h3>
        <div className="line-chart">
          <svg viewBox="0 0 300 150" className="line-chart-svg">
            {/* X and Y axes */}
            <line x1="30" y1="120" x2="280" y2="120" stroke="var(--text-muted)" strokeWidth="1" />
            <line x1="30" y1="30" x2="30" y2="120" stroke="var(--text-muted)" strokeWidth="1" />

            {/* Data points */}
            <polyline
              points="30,90 80,70 130,85 180,60 230,40 280,50"
              fill="none"
              stroke="var(--accent-color-2)"
              strokeWidth="2"
            />

            {/* Data points circles */}
            <circle cx="30" cy="90" r="3" fill="var(--accent-color-2)" />
            <circle cx="80" cy="70" r="3" fill="var(--accent-color-2)" />
            <circle cx="130" cy="85" r="3" fill="var(--accent-color-2)" />
            <circle cx="180" cy="60" r="3" fill="var(--accent-color-2)" />
            <circle cx="230" cy="40" r="3" fill="var(--accent-color-2)" />
            <circle cx="280" cy="50" r="3" fill="var(--accent-color-2)" />

            {/* X-axis labels */}
            <text x="30" y="135" fill="var(--text-muted)" fontSize="8" textAnchor="middle">Week 1</text>
            <text x="80" y="135" fill="var(--text-muted)" fontSize="8" textAnchor="middle">Week 2</text>
            <text x="130" y="135" fill="var(--text-muted)" fontSize="8" textAnchor="middle">Week 3</text>
            <text x="180" y="135" fill="var(--text-muted)" fontSize="8" textAnchor="middle">Week 4</text>
            <text x="230" y="135" fill="var(--text-muted)" fontSize="8" textAnchor="middle">Week 5</text>
            <text x="280" y="135" fill="var(--text-muted)" fontSize="8" textAnchor="middle">Week 6</text>

            {/* Y-axis labels */}
            <text x="25" y="120" fill="var(--text-muted)" fontSize="8" textAnchor="end">0%</text>
            <text x="25" y="90" fill="var(--text-muted)" fontSize="8" textAnchor="end">25%</text>
            <text x="25" y="60" fill="var(--text-muted)" fontSize="8" textAnchor="end">50%</text>
            <text x="25" y="30" fill="var(--text-muted)" fontSize="8" textAnchor="end">75%</text>
          </svg>
        </div>
      </div>
    );
  };

  // Navigation items
  const navItems = [
    { name: 'Dashboard', route: '/dashboard' },
    { name: 'Student Corner', route: '/student-corner' },
    { name: 'Resources', route: '/resources' },
    { name: 'Mentor Interface', route: '/mentor-interface' }
  ];

  const handleNavClick = (route, tabName) => {
    setActiveTab(tabName);
    navigate(route);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Handle profile completion - added new function
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

          {/* Added Logout Button */}
          <div className="sidebar-footer">
            <button onClick={handleLogout} className="btn-logout">
              Log Out
            </button>
          </div>

          {/* Help Section */}
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
            <h1>Mentor Interface</h1>
          </header>

          <main className="dashboard-content">
            {/* Profile Check - Show content only if profile is completed */}
            {user && !user.profileCompleted ? (
              <div className="profile-incomplete-container">
                <div className="profile-incomplete-card">
                  <div className="profile-incomplete-icon">📊</div>
                  <h2>Profile Incomplete</h2>
                  <p>Please complete your profile setup to access detailed analytics and student performance data.</p>
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
                    { label: 'Total Hours', value: statsData.totalHours, icon: '⏱️' },
                    { label: 'Total Revisits', value: statsData.totalRevisits, icon: '🔄' },
                    { label: 'Average Score', value: `${statsData.averageScore}%`, icon: '📝' },
                    { label: 'Performance', value: `${statsData.performanceScore}%`, icon: '📊' }
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

                {/* Show Graphs Button */}
                <div className="view-all-container">
                  <button
                    className="btn-primary"
                    onClick={() => setShowGraphs(!showGraphs)}
                  >
                    {showGraphs ? 'Hide Graphs' : 'Show Detailed Analytics'}
                  </button>
                </div>

                {/* Graphs Section - Shown only when button is clicked */}
                {showGraphs && (
                  <div className="graphs-section">
                    <div className="graph-grid">
                      <div className="graph-card">
                        <BarChart
                          data={subjectHours}
                          title="Hours Spent Per Subject"
                          valueKey="hours"
                          labelKey="subject"
                          barColor="var(--accent-color-3)"
                        />
                      </div>

                      <div className="graph-card">
                        <BarChart
                          data={resourceRevisits}
                          title="Most Revisited Resources"
                          valueKey="revisits"
                          labelKey="resource"
                          barColor="var(--accent-color-2)"
                        />
                      </div>

                      <div className="graph-card wide-card">
                        <LineChart title="Weekly Performance Trend" />
                      </div>

                      <div className="graph-card">
                        <DonutChart
                          data={quizPerformanceData}
                          title="Quiz Performance by Category"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Subject Details Table */}
                <div className="quiz-section">
                  <h2 className="section-title">Subject Breakdown</h2>
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th className="text-left">Subject</th>
                          <th className="text-center">Hours</th>
                          <th className="text-center">% of Total</th>
                          <th className="text-center">Avg. Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subjectHours.map((subject, index) => {
                          // Generate random avg scores for demonstration
                          const avgScore = 65 + Math.floor(Math.random() * 30);
                          const scoreColor = getScoreColor(avgScore);
                          const percentage = ((subject.hours / statsData.totalHours) * 100).toFixed(1);

                          return (
                            <tr key={index}>
                              <td>{subject.subject}</td>
                              <td className="text-center">{subject.hours} hrs</td>
                              <td className="text-center">{percentage}%</td>
                              <td className="text-center">
                                <span className="score-badge" style={{
                                  backgroundColor: scoreColor.bg,
                                  color: scoreColor.text
                                }}>
                                  {avgScore}%
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </main>
        </div>

        {/* Add right panel for profile incomplete state - similar to Resources.jsx */}
        {user && !user.profileCompleted && (
          <div className="right-panel">
            <div className="profile-incomplete-hint">
              <h3>Unlock Mentor Analytics</h3>
              <p>Complete your profile to access detailed student performance analytics, learning patterns, and mentoring tools.</p>
              <ul className="feature-list">
                <li>Track student progress across subjects</li>
                <li>Identify learning patterns and trends</li>
                <li>Access personalized student recommendations</li>
                <li>Generate performance reports</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorInterface;