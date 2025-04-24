import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';

// Create auth context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  API_BASE_URL: "http://localhost:8000",
});

// Backend API base URL (adjust if your backend runs elsewhere)
const API_BASE_URL = 'http://localhost:8000';

// Function to call the backend login endpoint
const apiLogin = async (email: string, password: string): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

   if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Login failed');
    } catch (error) {
      throw new Error('Login failed');
    }
  }

  // Backend currently only returns a message.
  // Ideally, it should return the user object (id, email, name).
  // We'll construct a partial user object for now.
  // TODO: Update when backend returns full user data.
  const data = await response.json();
  return data;
};

// Function to call the backend signup endpoint
const apiSignup = async (email: string, password: string, name: string): Promise<User> => {
  // Note: The backend User model doesn't explicitly define 'name',
  // but we send it based on the frontend form. Adjust if needed.
  const response = await fetch(`${API_BASE_URL}/signup/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // Only send email and password, as defined in backend/models.py
    body: JSON.stringify({ email, password, name }),
  });

  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Signup failed');
    } catch (error) {
      throw new Error('Signup failed');
    }
  }

  // Backend currently only returns a message.
  // Ideally, it should return the new user object (id, email, name).
  const data = await response.json();
  return data;
};


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check local storage for user data
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Call the actual API login function
      const user = await apiLogin(email, password); 
      setUser(user);
      // Store potentially partial user data
      localStorage.setItem('user', JSON.stringify(user)); 
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      // Call the actual API signup function
      const user = await apiSignup(email, password, name); 
      setUser(user);
      // Store potentially partial user data
      localStorage.setItem('user', JSON.stringify(user)); 
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      setUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, API_BASE_URL }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
