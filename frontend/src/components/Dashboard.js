import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import FeedbackList from './feedback/FeedbackList';
import FeedbackForm from './feedback/FeedbackForm';
import FeedbackDetail from './feedback/FeedbackDetail';
import { Rocket, MessageSquare, Plus, LogOut, User } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-2">
                <Rocket className="w-8 h-8 text-indigo-600" />
                Product Feedback Tool
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                Welcome back, <strong className="text-gray-800">{user?.name}</strong>!
              </p>
            </div>
            <div className="flex gap-4 items-center">
              <button
                onClick={() => setCurrentView('list')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  currentView === 'list' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Feedback List
              </button>
              <button
                onClick={() => setCurrentView('form')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  currentView === 'form' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                <Plus className="w-4 h-4" />
                Submit Feedback
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
