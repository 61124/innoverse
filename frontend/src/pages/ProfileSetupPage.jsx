import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/ProfileSetup.css';

function ProfileSetupPage() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    city: '',
    educationLevel: '',
    educationDetails: '',
    profilePicture: null
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Prevent default form submission on Enter key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    };
    
    // Add the event listener to the document
    document.addEventListener('keydown', handleKeyDown);
    
    // Clean up the event listener when component unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Reset education details when education level changes
    if (name === 'educationLevel') {
      setFormData(prev => ({ ...prev, educationDetails: '' }));
    }
  };
  
  const handleFileChange = (e) => {
    // In a real app, you would handle file uploads to a server
    setFormData({ ...formData, profilePicture: e.target.files[0] });
  };
  
  // Check if required fields are filled for the current step
  const isStepComplete = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim() !== '' && formData.age !== '';
      case 2:
        return formData.city.trim() !== '';
      case 3:
        return formData.educationLevel !== '' && formData.educationDetails !== '';
      case 4:
        // Profile picture is optional
        return true;
      default:
        return false;
    }
  };
  
  const nextStep = () => {
    // Validate current step
    if (currentStep === 1) {
      if (!formData.name) {
        setError('Please enter your name');
        return;
      }
      if (!formData.age) {
        setError('Please enter your age');
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.city) {
        setError('Please enter your city');
        return;
      }
    } else if (currentStep === 3) {
      if (!formData.educationLevel) {
        setError('Please select your education level');
        return;
      }
      if (formData.educationLevel !== '' && !formData.educationDetails) {
        setError('Please provide education details');
        return;
      }
    }
    
    setError('');
    setCurrentStep(Math.min(currentStep + 1, totalSteps));
  };
  
  const prevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Final validation
    if (!formData.name || !formData.age || !formData.city || !formData.educationLevel) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    const data = new FormData();
    for (const key in formData) {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    }

    try {
      const response = await fetch('http://localhost:8000/api/profile-setup/', {
        method: 'POST',
        body: data,
        credentials: 'include',  // Include cookies for authentication
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const result = await response.json();
      if (result.status === 'success') {
        updateProfile({ ...formData, profileCompleted: true });
        navigate('/dashboard');
      } else {
        setError(result.message || 'Failed to save profile');
      }
    } catch (error) {
      console.error('Error submitting profile:', error);
      setError('Failed to connect to server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Custom function to handle form submission attempt
  const handleFormSubmitAttempt = (e) => {
    // Always prevent default form submission
    e.preventDefault();
  };
  
  const renderEducationDetailsField = () => {
    const { educationLevel } = formData;
    
    if (educationLevel === 'school') {
      return (
        <div className="form-group">
          <label htmlFor="educationDetails">Standard</label>
          <select
            id="educationDetails"
            name="educationDetails"
            value={formData.educationDetails}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select your standard</option>
            {[...Array(10)].map((_, i) => (
              <option key={i} value={`${i+1}`}>{`${i+1}${getOrdinalSuffix(i+1)} Standard`}</option>
            ))}
          </select>
        </div>
      );
    } else if (educationLevel === 'jrCollege') {
      return (
        <div className="form-group">
          <label htmlFor="educationDetails">Course</label>
          <select
            id="educationDetails"
            name="educationDetails"
            value={formData.educationDetails}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select your course</option>
            <option value="neet">NEET</option>
            <option value="jee">JEE</option>
          </select>
        </div>
      );
    } else if (educationLevel === 'university') {
      return (
        <div className="form-group">
          <label htmlFor="educationDetails">Field</label>
          <select
            id="educationDetails"
            name="educationDetails"
            value={formData.educationDetails}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select your field</option>
            <option value="medical">Medical</option>
            <option value="engineering">Engineering</option>
          </select>
        </div>
      );
    }
    
    return null;
  };

  // Helper function for ordinal suffixes
  const getOrdinalSuffix = (num) => {
    const lastDigit = num % 10;
    const lastTwoDigits = num % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
      return 'th';
    }
    
    switch (lastDigit) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return (
    <div className="profile-setup-page">
      <div className="setup-container">
        <div className="setup-header">
          <h1>Set Up Your Student Profile</h1>
          <p>Complete your profile to get the most out of our learning platform</p>
          
          <div className="progress-bar">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div 
                key={index} 
                className={`progress-step ${index + 1 <= currentStep ? 'active' : ''}`}
              />
            ))}
          </div>
          <div className="progress-text">Step {currentStep} of {totalSteps}</div>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleFormSubmitAttempt} className="setup-form">
          {currentStep === 1 && (
            <div className="setup-step">
              <h2>Personal Information</h2>
              
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  min="5"
                  max="99"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Your age"
                  required
                />
              </div>
              
              <div className="step-buttons">
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={nextStep}
                  disabled={loading || !isStepComplete()}
                >
                  Next
                </button>
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="setup-step">
              <h2>Location</h2>
              
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter your city"
                  required
                />
              </div>
              
              <div className="step-buttons">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={prevStep}
                  disabled={loading}
                >
                  Back
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={nextStep}
                  disabled={loading || !isStepComplete()}
                >
                  Next
                </button>
              </div>
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="setup-step">
              <h2>Education Details</h2>
              
              <div className="form-group">
                <label htmlFor="educationLevel">Education Level</label>
                <select
                  id="educationLevel"
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select your education level</option>
                  <option value="school">School (1-10th)</option>
                  <option value="jrCollege">Junior College</option>
                  <option value="university">University</option>
                </select>
              </div>
              
              {formData.educationLevel && renderEducationDetailsField()}
              
              <div className="step-buttons">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={prevStep}
                  disabled={loading}
                >
                  Back
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={nextStep}
                  disabled={loading || !isStepComplete()}
                >
                  Next
                </button>
              </div>
            </div>
          )}
          
          {currentStep === 4 && (
            <div className="setup-step">
              <h2>Profile Picture</h2>
              
              <div className="profile-picture-upload">
                {formData.profilePicture ? (
                  <div className="preview">
                    <p>Selected file: {formData.profilePicture.name}</p>
                  </div>
                ) : (
                  <div className="preview placeholder">
                    <span>Preview</span>
                  </div>
                )}
                
                <div className="upload-controls">
                  <label htmlFor="profilePicture" className="btn btn-outline">
                    Select Image
                  </label>
                  <input
                    type="file"
                    id="profilePicture"
                    name="profilePicture"
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
              
              <div className="step-buttons">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={prevStep}
                  disabled={loading}
                >
                  Back
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Complete Setup'}
                </button>
              </div>
            </div>
          )}
        </form>
        
        <div className="setup-skip">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="btn-text"
            disabled={loading}
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileSetupPage;