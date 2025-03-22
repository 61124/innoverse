import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/AuthPages.css';

function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password })
      });
      const data = await response.json();

      if (data.status === 'success') {
        register({ name: formData.name, email: formData.email, profileCompleted: false });
        navigate('/profile-setup');
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Failed to connect to server. Please try again later.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container responsive-container">
        <div className="auth-form-container">
          <h1>Create an Account</h1>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name" className="styled-label">Full Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" required className="styled-input" />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="styled-label">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your email address" required className="styled-input" />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="styled-label">Password</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Choose a password" required className="styled-input" />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword" className="styled-label">Confirm Password</label>
              <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" required className="styled-input" />
            </div>
            <div className="form-footer">
              <button type="submit" className="btn btn-primary">Create Account</button>
            </div>
          </form>

          <div className="auth-links">
            <p>Already have an account? <Link to="/login">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
