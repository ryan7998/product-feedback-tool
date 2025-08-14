import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import FeedbackList from './feedback/FeedbackList';
import FeedbackForm from './feedback/FeedbackForm';
import FeedbackDetail from './feedback/FeedbackDetail';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState('list'); // 'list', 'form', 'detail'
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const handleLogout = async () => {
    await logout();
  };

  const handleViewFeedback = (feedback) => {
    setSelectedFeedback(feedback);
    setCurrentView('detail');
  };

  const handleEditFeedback = (feedback) => {
    setSelectedFeedback(feedback);
    setCurrentView('form');
  };

  const handleFeedbackSubmitted = () => {
    setCurrentView('list');
    setSelectedFeedback(null);
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedFeedback(null);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'form':
        return (
          <FeedbackForm
            feedback={selectedFeedback}
            onSubmit={handleFeedbackSubmitted}
            onCancel={handleBackToList}
          />
        );
      case 'detail':
        return (
          <FeedbackDetail
            feedback={selectedFeedback}
            onBack={handleBackToList}
            onEdit={handleEditFeedback}
          />
        );
      default:
        return (
          <FeedbackList
            onViewFeedback={handleViewFeedback}
            onEditFeedback={handleEditFeedback}
            onDeleteFeedback={() => {}} // Handled in FeedbackList
          />
        );
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
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
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button
            onClick={() => setCurrentView('list')}
            style={{
              padding: '10px 20px',
              backgroundColor: currentView === 'list' ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            📋 Feedback List
          </button>
          <button
            onClick={() => setCurrentView('form')}
            style={{
              padding: '10px 20px',
              backgroundColor: currentView === 'form' ? '#28a745' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ✨ Submit Feedback
          </button>
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
      </div>

      {/* Main Content */}
      <div>
        {renderContent()}
      </div>

      {/* Quick Stats */}
      {currentView === 'list' && (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginTop: '30px'
        }}>
          <h3 style={{ marginBottom: '15px', color: '#333' }}>📊 Quick Stats</h3>
          <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>🐛</div>
              <div style={{ fontSize: '14px', color: '#666' }}>Bug Reports</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>💡</div>
              <div style={{ fontSize: '14px', color: '#666' }}>Feature Requests</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>⚡</div>
              <div style={{ fontSize: '14px', color: '#666' }}>Improvements</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#6c757d' }}>💬</div>
              <div style={{ fontSize: '14px', color: '#666' }}>General</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
