import React, { useState, useEffect } from 'react';
import config from '../../config/config';
import { Loader } from '../../components/ui';
import { Edit, FileText } from 'lucide-react';

const FeedbackForm = ({ feedback, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize form with existing feedback data if editing
  useEffect(() => {
    if (feedback) {
      setFormData({
        title: feedback.title || '',
        description: feedback.description || '',
        category: feedback.category || 'general'
      });
    }
  }, [feedback]);

  const categories = [
    { value: 'bug_report', label: 'Bug Report' },
    { value: 'feature_request', label: 'Feature Request' },
    { value: 'improvement', label: 'Improvement' },
    { value: 'general', label: 'General Feedback' }
  ];

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

    try {
      const url = feedback 
        ? `${config.API_BASE_URL}${config.ENDPOINTS.FEEDBACK.UPDATE(feedback.id)}`
        : `${config.API_BASE_URL}${config.ENDPOINTS.FEEDBACK.CREATE}`;
      
      const method = feedback ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Failed to ${feedback ? 'update' : 'submit'} feedback`);
      }

      onSubmit(result.feedback || result);
      setFormData({ title: '', description: '', category: 'general' });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const isEditing = !!feedback;

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="max-w-2xl mx-auto p-8 relative">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-3">
            {isEditing ? (
              <>
                <Edit className="w-8 h-8 text-indigo-600" />
                Edit Feedback
              </>
            ) : (
              <>
                <FileText className="w-8 h-8 text-indigo-600" />
                Submit New Feedback
              </>
            )}
          </h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

      <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Brief description of your feedback"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-8">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="6"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-vertical"
              placeholder="Provide detailed description of your feedback..."
            />
          </div>

          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px]"
            >
              {loading ? (
                <>
                  <Loader variant="spinner" size="sm" />
                  {isEditing ? 'Updating...' : 'Submitting...'}
                </>
              ) : (
                isEditing ? 'Update Feedback' : 'Submit Feedback'
              )}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;
