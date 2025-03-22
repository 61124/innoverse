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
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === 'educationLevel') {
      setFormData(prev => ({ ...prev, educationDetails: '' }));
    }
  };
  
  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePicture: e.target.files[0] });
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

  return (
    <div className="profile-setup-page">
      <div className="profile-setup-container">
        <h1>Complete Your Profile</h1>
        <p>Step {currentStep} of {totalSteps}</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="profile-setup-form">
          {currentStep === 1 && (
            <div className="step-container">
              <h2>Basic Information</h2>
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
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Enter your age"
                  min="1"
                  max="120"
                  required
                />
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="step-container">
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
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="step-container">
              <h2>Education</h2>
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
                  <option value="school">School</option>
                  <option value="jrCollege">Junior College</option>
                  <option value="university">University</option>
                </select>
              </div>
              
              {renderEducationDetailsField()}
            </div>
          )}
          
          {currentStep === 4 && (
            <div className="step-container">
              <h2>Profile Picture</h2>
              <div className="form-group">
                <label htmlFor="profilePicture">Upload Profile Picture (Optional)</label>
                <input
                  type="file"
                  id="profilePicture"
                  name="profilePicture"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              
              {formData.profilePicture && (
                <div className="preview-container">
                  <p>Selected file: {formData.profilePicture.name}</p>
                </div>
              )}
            </div>
          )}
          
          <div className="form-navigation">
            {currentStep > 1 && (
              <button 
                type="button" 
                onClick={prevStep}
                className="btn btn-secondary"
                disabled={loading}
              >
                Back
              </button>
            )}
            
            {currentStep < totalSteps ? (
              <button 
                type="button" 
                onClick={nextStep}
                className="btn btn-primary"
                disabled={loading}
              >
                Next
              </button>
            ) : (
              <button 
                type="submit" 
                className="btn btn-success"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Complete Setup'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileSetupPage;