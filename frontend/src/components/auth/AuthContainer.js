import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const AuthContainer = () => {
  const [isLogin, setIsLogin] = useState(true);

  const switchToRegister = () => setIsLogin(false);
  const switchToLogin = () => setIsLogin(true);

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '500px'
      }}>
        {isLogin ? (
          <Login onSwitchToRegister={switchToRegister} />
        ) : (
          <Register onSwitchToLogin={switchToLogin} />
        )}
      </div>
    </div>
  );
};

export default AuthContainer;
