import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Input, ErrorMessage, DemoUsers, AuthHeader } from '../ui';

const Login = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: 'john@example.com',
    password: 'password'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div>
      {/* Subtle Dot Pattern Background */}
      <div 
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }}
      ></div>
      
      {/* Main Content Card */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-10 relative z-10">
        <AuthHeader
          subtitle="Welcome back! 👋"
          description="Please sign-in to your account and start the adventure"
        />
        
        <ErrorMessage message={error} className="mb-6" />
        
        <form onSubmit={handleSubmit} className="text-left">
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
          
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
          
                  <Button
          type="submit"
          loading={loading}
          variant="primary"
          className="mb-10"
        >
          Sign In
        </Button>
        </form>
        
        <div className="border-t border-gray-200 pt-8 mt-8">
          <DemoUsers />
        </div>
        
        {/* Account Switching Section */}
        <div className="mt-10 pt-8 border-t border-primary-200 text-center">
          <div className="text-sm text-primary-500 mb-3">
            New on our platform?
          </div>
          <Button
            onClick={onSwitchToRegister}
            variant="outline"
            size="sm"
            className="min-w-[140px]"
          >
            Create an account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
