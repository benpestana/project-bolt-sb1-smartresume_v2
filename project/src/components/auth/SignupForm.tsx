import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Mail, Lock, User } from 'lucide-react';

interface SignupFormProps {
  onToggleForm: () => void;
  onAuth: (email: string, password: string, name: string, isSignup: boolean) => Promise<void>;
}

const SignupForm: React.FC<SignupFormProps> = ({ onToggleForm, onAuth }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ 
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  
  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    
    if (!name) {
      newErrors.name = 'Name is required';
    }
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    onAuth(email, password, name, true);
  };
  
  return (
    <div className="bg-white p-8 rounded-lg shadow-card max-w-md w-full mx-auto animate-fade-in">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Create an Account</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="name"
          type="text"
          label="Full Name"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          startIcon={<User className="h-5 w-5 text-gray-400" />}
          required
        />
        
        <Input
          id="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          startIcon={<Mail className="h-5 w-5 text-gray-400" />}
          required
        />
        
        <Input
          id="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          startIcon={<Lock className="h-5 w-5 text-gray-400" />}
          helperText="Must be at least 6 characters"
          required
        />
        
        <Input
          id="confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          startIcon={<Lock className="h-5 w-5 text-gray-400" />}
          required
        />
        
        <div>
          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
          >
            Sign Up
          </Button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onToggleForm}
            className="text-primary-600 hover:text-primary-500 font-medium"
          >
            Log In
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
