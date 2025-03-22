import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Important for session cookies
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        const userData = { 
          email: email, 
          profileCompleted: data.profileCompleted 
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true, profileCompleted: data.profileCompleted };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Failed to connect to server. Please try again later.' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        // After registration, automatically log in
        return login(email, password);
      } else {
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Failed to connect to server. Please try again later.' };
    }
  };

  const logout = async () => {
    try {
      // Call logout API to clear server-side session
      await fetch('http://localhost:8000/api/logout/', {
        method: 'POST',
        credentials: 'include', // Important for session cookies
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage and state, even if API call fails
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      // Create FormData for file upload support
      const formData = new FormData();
      for (const key in profileData) {
        if (profileData[key] !== null && profileData[key] !== undefined) {
          formData.append(key, profileData[key]);
        }
      }

      const response = await fetch('http://localhost:8000/api/profile-setup/', {
        method: 'POST',
        body: formData,
        credentials: 'include', // Important for session cookies
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        // Update local user data
        const updatedUser = { ...user, ...profileData, profileCompleted: true };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Profile update failed' };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, message: 'Failed to connect to server. Please try again later.' };
    }
  };

  const value = {
    user,
    setUser, // Keeping this for backward compatibility
    login,
    register,
    logout,
    updateProfile,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};