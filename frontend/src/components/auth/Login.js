import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

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
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>🔐 Login</h2>
      <p>Welcome back! Please sign in to your account.</p>
      
      {error && (
        <div style={{ 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
            placeholder="Enter your email"
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
            placeholder="Enter your password"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      
      {/* Demo Users Section */}
      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px', 
        border: '1px solid #e9ecef' 
      }}>
        <h3 style={{ 
          margin: '0 0 15px 0', 
          fontSize: '18px', 
          color: '#495057',
          textAlign: 'center'
        }}>
          🧪 Demo Accounts
        </h3>
        <p style={{ 
          margin: '0 0 15px 0', 
          fontSize: '14px', 
          color: '#6c757d',
          textAlign: 'center'
        }}>
          Use these demo accounts to test the application:
        </p>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '10px',
          fontSize: '12px'
        }}>
          <div style={{ padding: '8px', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #dee2e6' }}>
            <strong>John Smith</strong><br />
            john@example.com<br />
            <span style={{ color: '#28a745' }}>password</span>
          </div>
          <div style={{ padding: '8px', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #dee2e6' }}>
            <strong>Sarah Johnson</strong><br />
            sarah@example.com<br />
            <span style={{ color: '#28a745' }}>password</span>
          </div>
          <div style={{ padding: '8px', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #dee2e6' }}>
            <strong>Mike Chen</strong><br />
            mike@example.com<br />
            <span style={{ color: '#28a745' }}>password</span>
          </div>
          <div style={{ padding: '8px', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #dee2e6' }}>
            <strong>Emily Davis</strong><br />
            emily@example.com<br />
            <span style={{ color: '#28a745' }}>password</span>
          </div>
          <div style={{ padding: '8px', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #dee2e6' }}>
            <strong>Alex Rodriguez</strong><br />
            alex@example.com<br />
            <span style={{ color: '#28a745' }}>password</span>
          </div>
          <div style={{ padding: '8px', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #dee2e6' }}>
            <strong>Lisa Wang</strong><br />
            lisa@example.com<br />
            <span style={{ color: '#28a745' }}>password</span>
          </div>
          <div style={{ padding: '8px', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #dee2e6' }}>
            <strong>David Brown</strong><br />
            david@example.com<br />
            <span style={{ color: '#28a745' }}>password</span>
          </div>
        </div>
        <p style={{ 
          margin: '15px 0 0 0', 
          fontSize: '12px', 
          color: '#6c757d',
          textAlign: 'center',
          fontStyle: 'italic'
        }}>
          All demo accounts use the same password: <strong>password</strong>
        </p>
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p>Don't have an account?</p>
        <button
          onClick={onSwitchToRegister}
          style={{
            background: 'none',
            border: 'none',
            color: '#007bff',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Create an account
        </button>
      </div>
    </div>
  );
};

export default Login;
