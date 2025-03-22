import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Resources.css';

const Resources = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Resources');
  const [activeLevel, setActiveLevel] = useState('10th Standard');

  // Sample education levels
  const educationLevels = ['10th Standard', '12th Standard', 'Undergraduate', 'Graduate'];

  // Sample resources data organized by education level
  const resourcesData = {
    '10th Standard': {
      videos: [
        { id: 1, title: 'Introduction to Algebra', platform: 'YouTube', creator: 'Math Simplified', duration: '15 min', thumbnail: 'algebra' },
        { id: 2, title: 'Understanding Physics: Forces & Motion', platform: 'YouTube', creator: 'Science Explained', duration: '22 min', thumbnail: 'physics' },
        { id: 3, title: 'Biology Basics: Cell Structure', platform: 'YouTube', creator: 'Bio Learning', duration: '18 min', thumbnail: 'biology' },
        { id: 4, title: 'Chemistry Fundamentals: Periodic Table', platform: 'YouTube', creator: 'ChemistryHub', duration: '25 min', thumbnail: 'chemistry' },
      ],
      notes: [
        { id: 1, title: 'Comprehensive Trigonometry Notes', format: 'PDF', pages: 32, subject: 'Mathematics' },
        { id: 2, title: 'English Literature: Shakespeare Analysis', format: 'PDF', pages: 45, subject: 'English' },
        { id: 3, title: 'Geography: Earth\'s Structure Notes', format: 'PDF', pages: 28, subject: 'Geography' },
      ],
      websites: [
        { id: 1, title: 'Interactive Math Problems', url: 'mathproblems.example.com', rating: 4.8 },
        { id: 2, title: 'Science Experiment Database', url: 'scienceexp.example.com', rating: 4.6 },
        { id: 3, title: 'Historical Timeline Explorer', url: 'historytimeline.example.com', rating: 4.5 },
      ]
    },
    '12th Standard': {
      videos: [
        { id: 1, title: 'Advanced Calculus Explained', platform: 'YouTube', creator: 'Math Masters', duration: '32 min', thumbnail: 'calculus' },
        { id: 2, title: 'Organic Chemistry Fundamentals', platform: 'YouTube', creator: 'Chemistry Experts', duration: '45 min', thumbnail: 'organic' },
        { id: 3, title: 'Physics: Quantum Mechanics Basics', platform: 'YouTube', creator: 'Physics Simplified', duration: '28 min', thumbnail: 'quantum' },
      ],
      notes: [
        { id: 1, title: 'Comprehensive Calculus Reference', format: 'PDF', pages: 65, subject: 'Mathematics' },
        { id: 2, title: 'Modern Literature Analysis', format: 'PDF', pages: 58, subject: 'English' },
        { id: 3, title: 'Economics: Market Structures', format: 'PDF', pages: 42, subject: 'Economics' },
      ],
      websites: [
        { id: 1, title: 'College Preparation Hub', url: 'collegeprep.example.com', rating: 4.9 },
        { id: 2, title: 'Advanced Science Simulations', url: 'sciencesim.example.com', rating: 4.7 },
      ]
    },
    'Undergraduate': {
      videos: [
        { id: 1, title: 'Data Structures & Algorithms', platform: 'YouTube', creator: 'CS Fundamentals', duration: '55 min', thumbnail: 'dsa' },
        { id: 2, title: 'Introduction to Machine Learning', platform: 'YouTube', creator: 'AI Educators', duration: '48 min', thumbnail: 'ml' },
      ],
      notes: [
        { id: 1, title: 'Database Management Systems', format: 'PDF', pages: 85, subject: 'Computer Science' },
        { id: 2, title: 'Engineering Mechanics Complete Guide', format: 'PDF', pages: 110, subject: 'Engineering' },
      ],
      websites: [
        { id: 1, title: 'Programming Practice Platform', url: 'codepractice.example.com', rating: 4.8 },
        { id: 2, title: 'Research Paper Database', url: 'researchhub.example.com', rating: 4.9 },
      ]
    },
    'Graduate': {
      videos: [
        { id: 1, title: 'Advanced Statistical Analysis', platform: 'YouTube', creator: 'Stats Pro', duration: '65 min', thumbnail: 'stats' },
        { id: 2, title: 'Research Methodology Workshop', platform: 'YouTube', creator: 'Research Experts', duration: '75 min', thumbnail: 'research' },
      ],
      notes: [
        { id: 1, title: 'Advanced AI Concepts & Applications', format: 'PDF', pages: 128, subject: 'Computer Science' },
        { id: 2, title: 'Finance: Investment Strategies', format: 'PDF', pages: 95, subject: 'Finance' },
      ],
      websites: [
        { id: 1, title: 'Academic Journal Access Portal', url: 'journalaccess.example.com', rating: 4.9 },
        { id: 2, title: 'Career Development Resources', url: 'careerdev.example.com', rating: 4.7 },
      ]
    }
  };

  // Function to generate placeholder for thumbnails
  const getThumbnailColor = (thumbnail) => {
    const colors = {
      'algebra': '#89a5df',
      'physics': '#e46e7f',
      'biology': '#e8e191',
      'chemistry': '#ff7f50',
      'calculus': '#89a5df',
      'organic': '#e46e7f',
      'quantum': '#e8e191',
      'dsa': '#89a5df',
      'ml': '#e46e7f',
      'stats': '#e8e191',
      'research': '#ff7f50'
    };
    return colors[thumbnail] || '#89a5df';
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
          <h1 className="gradient-text title-text">Educational Resources</h1>

          {/* Profile Check - Show content only if profile is completed */}
          {user && !user.profileCompleted ? (
            <div className="profile-incomplete-container">
              <div className="profile-incomplete-card">
                <div className="profile-incomplete-icon">📚</div>
                <h2>Profile Incomplete</h2>
                <p>Please complete your profile setup to access educational resources tailored to your needs.</p>
                <button onClick={handleCompleteProfile} className="btn-primary">
                  Complete Your Profile
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Education Level Selector */}
              <div className="education-level-tabs">
                {educationLevels.map((level) => (
                  <button
                    key={level}
                    className={`level-tab ${activeLevel === level ? 'level-tab-active' : ''}`}
                    onClick={() => setActiveLevel(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>

              {/* Resource Statistics */}
              <div className="stats-grid">
                {[
                  { label: 'Video Tutorials', value: resourcesData[activeLevel].videos.length, icon: '📹' },
                  { label: 'Study Notes', value: resourcesData[activeLevel].notes.length, icon: '📝' },
                  { label: 'Useful Websites', value: resourcesData[activeLevel].websites.length, icon: '🌐' },
                  { label: 'Practice Resources', value: '10+', icon: '⚙️' }
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

              {/* Video Resources */}
              <div className="resource-section">
                <h2 className="section-title">Video Tutorials</h2>
                <div className="videos-grid">
                  {resourcesData[activeLevel].videos.map((video) => (
                    <div key={video.id} className="video-card">
                      <div
                        className="video-thumbnail"
                        style={{ backgroundColor: getThumbnailColor(video.thumbnail) }}
                      >
                        <span className="play-icon">▶️</span>
                      </div>
                      <div className="video-info">
                        <h3 className="video-title">{video.title}</h3>
                        <div className="video-meta">
                          <span className="video-creator">{video.creator}</span>
                          <span className="video-duration">{video.duration}</span>
                        </div>
                        <span className="video-platform">{video.platform}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="view-all-container">
                  <button className="btn-primary">View All Videos</button>
                </div>
              </div>

              {/* Notes Resources */}
              <div className="resource-section">
                <h2 className="section-title">Study Notes</h2>
                <div className="notes-container">
                  {resourcesData[activeLevel].notes.map((note) => (
                    <div key={note.id} className="note-card">
                      <div className="note-icon">📄</div>
                      <div className="note-info">
                        <h3 className="note-title">{note.title}</h3>
                        <div className="note-meta">
                          <span className="note-subject">{note.subject}</span>
                          <span className="note-format">{note.format}</span>
                          <span className="note-pages">{note.pages} pages</span>
                        </div>
                      </div>
                      <button className="download-button">Download</button>
                    </div>
                  ))}
                </div>
                <div className="view-all-container">
                  <button className="btn-primary">Browse All Notes</button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Panel - Only show if profile is completed */}
        <div className="right-panel">
          {user && !user.profileCompleted ? (
            <div className="profile-incomplete-hint">
              <h3>Unlock All Features</h3>
              <p>Complete your profile to access personalized educational resources and learning materials.</p>
            </div>
          ) : (
            <>
              <h2 className="section-title">Recommended Websites</h2>

              <div className="websites-container">
                {resourcesData[activeLevel].websites.map((website) => (
                  <div key={website.id} className="website-card">
                    <div className="website-header">
                      <h3 className="website-title">{website.title}</h3>
                      <div className="website-rating">
                        <span className="rating-star">★</span>
                        <span className="rating-value">{website.rating}</span>
                      </div>
                    </div>
                    <p className="website-url">{website.url}</p>
                    <button className="visit-button">Visit Website</button>
                  </div>
                ))}
              </div>

              <div className="view-all-websites">
                <button className="btn-secondary">View All Websites</button>
              </div>

              <div className="resource-request">
                <h3 className="request-title">Need Specific Resources?</h3>
                <p className="request-text">Can't find what you're looking for? Request specific educational materials from our team.</p>
                <button className="btn-primary request-button">Request Resources</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Resources;