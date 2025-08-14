import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div>
          <h1>🚀 Product Feedback Tool</h1>
          <p>Welcome back, <strong>{user?.name}</strong>!</p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h2>🎉 Authentication Successful!</h2>
        <p>You are now logged in and ready to use the Product Feedback Tool.</p>
        
        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          backgroundColor: '#e8f5e8', 
          borderRadius: '4px',
          textAlign: 'left'
        }}>
          <h3>✅ What's Working:</h3>
          <ul>
            <li><strong>User Authentication:</strong> Login and registration</li>
            <li><strong>Token Management:</strong> Automatic token handling</li>
            <li><strong>API Communication:</strong> CORS and endpoints working</li>
            <li><strong>State Management:</strong> User context across components</li>
          </ul>
        </div>

        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          backgroundColor: '#fff3cd', 
          borderRadius: '4px',
          textAlign: 'left'
        }}>
          <h3>🚧 Coming Next:</h3>
          <ul>
            <li><strong>Feedback Management:</strong> Submit and view feedback</li>
            <li><strong>Comment System:</strong> Add comments to feedback</li>
            <li><strong>User Dashboard:</strong> Manage your feedback and profile</li>
            <li><strong>Admin Features:</strong> Manage feedback status and priorities</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
