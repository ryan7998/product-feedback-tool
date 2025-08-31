import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Input, ErrorMessage, AuthHeader } from '../ui';

const Register = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();

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

    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const result = await register(formData.name, formData.email, formData.password, formData.password_confirmation);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div>
      {/* Subtle Dot Pattern Background */}
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }}
      ></div>
      
      {/* Main Content Card */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-10 relative z-10">
        <AuthHeader
          subtitle="Create your account!"
          description="Join us and start sharing your feedback with the community"
        />
        
        <ErrorMessage message={error} className="mb-6" />
        
        <form onSubmit={handleSubmit} className="text-left">
          <Input
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
          
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
            placeholder="Enter your password (min 8 characters)"
            required
            minLength="8"
          />
          
          <Input
            label="Confirm Password"
            type="password"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
          />
          
          <Button
            type="submit"
            loading={loading}
            variant="success"
            className="mb-10"
          >
            Create Account
          </Button>
        </form>
        
        {/* Account Switching Section */}
        <div className="mt-10 pt-8 border-t border-primary-200 text-center">
          <div className="text-sm text-primary-500 mb-3">
            Already have an account?
          </div>
          <Button
            onClick={onSwitchToLogin}
            variant="outline"
            size="sm"
            className="min-w-[140px]"
          >
            Sign in instead
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Register;
