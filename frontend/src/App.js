import React from 'react';
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthContainer from './components/auth/AuthContainer';
import Dashboard from './components/Dashboard';
import { Loader } from './components/ui';

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader variant="ring" size="xl" text="Loading application..." />
      </div>
    );
  }

  return user ? <Dashboard /> : <AuthContainer />;
};

function App() {
  return (
    <AuthProvider>
      <div className="App relative">
        {/* Global Dot Pattern Background */}
        <div 
          className="fixed inset-0 opacity-15 pointer-events-none -z-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }}
        ></div>
        <AppContent />
      </div>
    </AuthProvider>
  );
}

export default App;
