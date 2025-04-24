import React, { useState, useContext } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { FileText } from 'lucide-react';
import { useAuth, AuthContext } from '../../context/AuthContext';

interface AuthScreenProps {
  onLoginSuccess: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup, loading } = useAuth();
  const { API_BASE_URL } = useContext(AuthContext);

  const handleAuth = async (email: string, password: string, name: string, isSignup: boolean) => {
    try {
      if (isSignup) {
        await signup(email, password, name);
        // Wait for loading to be false before calling onLoginSuccess
        const intervalId = setInterval(() => {
          if (!loading) {
            clearInterval(intervalId);
            onLoginSuccess();
          }
        }, 50); // Check every 50ms
      } else {
        await login(email, password);
         // Wait for loading to be false before calling onLoginSuccess
        const intervalId = setInterval(() => {
          if (!loading) {
            clearInterval(intervalId);
            onLoginSuccess();
          }
        }, 50); // Check every 50ms
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary-50 to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-2">
          <FileText className="h-10 w-10 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Smart Resume Builder</h1>
        </div>
      </div>
      
      <div className="max-w-md w-full mx-auto">
        {isLogin ? (
          <LoginForm onToggleForm={() => setIsLogin(false)} onAuth={(email, password, isSignup) => handleAuth(email, password, "", isSignup)} />
        ) : (
          <SignupForm onToggleForm={() => setIsLogin(true)} onAuth={(email, password, name, isSignup) => handleAuth(email, password, name, isSignup)}/>
        )}
      </div>
      
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Build Professional Resumes That Stand Out</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-card">
            <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Professional Templates</h3>
            <p className="text-gray-600">Choose from multiple templates designed for your field of study.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-card">
            <div className="w-12 h-12 rounded-full bg-accent-100 text-accent-600 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">AI-Powered Suggestions</h3>
            <p className="text-gray-600">Get smart recommendations to improve your resume content.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-card">
            <div className="w-12 h-12 rounded-full bg-secondary-100 text-secondary-600 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Export Options</h3>
            <p className="text-gray-600">Download your resume as PDF or DOCX to share with employers.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
