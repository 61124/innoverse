import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Check if the current page is the landing page
  const isLandingPage = location.pathname === '/';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span>AutomateX</span>
        </Link>
        
        {/* Hide menu options on the landing page */}
        {!isLandingPage && (
          <div className="navbar-menu-toggle" onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}

        {!isLandingPage && (
          <ul className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
            <li className="navbar-item">
              <Link to="/" className="navbar-link">Home</Link>
            </li>
            <li className="navbar-item">
              <Link to="/features" className="navbar-link">Features</Link>
            </li>
            <li className="navbar-item">
              <Link to="/pricing" className="navbar-link">Pricing</Link>
            </li>
            <li className="navbar-item">
              <Link to="/about" className="navbar-link">About</Link>
            </li>
          </ul>
        )}

        <div className={`navbar-auth ${menuOpen ? 'active' : ''}`}>
          <Link to="/login" className="navbar-link">Log In</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
