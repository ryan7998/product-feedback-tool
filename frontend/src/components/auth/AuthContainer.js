import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import { Footer } from '../ui';

const AuthContainer = () => {
  const [isLogin, setIsLogin] = useState(true);

  const switchToRegister = () => setIsLogin(false);
  const switchToLogin = () => setIsLogin(true);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg">
          {isLogin ? (
            <Login onSwitchToRegister={switchToRegister} />
          ) : (
            <Register onSwitchToLogin={switchToLogin} />
          )}
        </div>
      </div>
      
      {/* Footer - Full Width */}
      <Footer />
    </div>
  );
};

export default AuthContainer;
