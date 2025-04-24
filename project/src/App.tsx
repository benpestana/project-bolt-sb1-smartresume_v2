import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ResumeProvider } from './context/ResumeContext';
import AuthScreen from './components/auth/AuthScreen';
import Dashboard from './components/layout/Dashboard';

// Main App Container
const AppContent: React.FC = () => {
  const { user, loading, login } = useAuth();
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/message');
        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        setMessage('Failed to fetch message from backend. Please ensure the backend server is running.');
      }
    };

    fetchMessage();
  }, []);

  const handleLoginSuccess = () => {
    console.log('Login successful!');
  };
  
  // Show loading indicator
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  return (
    <ResumeProvider>
      {user ? <Dashboard /> : <AuthScreen onLoginSuccess={handleLoginSuccess} />}
      <p>{message}</p>
    </ResumeProvider>
  );
};

// Main App with context providers
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
