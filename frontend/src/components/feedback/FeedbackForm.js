import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import config from '../../config/config';

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
    { value: 'bug_report', label: '🐛 Bug Report' },
    { value: 'feature_request', label: '💡 Feature Request' },
    { value: 'improvement', label: '⚡ Improvement' },
    { value: 'general', label: '💬 General Feedback' }
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
    <div style={{ 
      backgroundColor: 'white', 
      padding: '30px', 
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>
        {isEditing ? '✏️ Edit Feedback' : '📝 Submit New Feedback'}
      </h2>
      
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

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
            placeholder="Brief description of your feedback"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="category" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
              backgroundColor: 'white'
            }}
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label htmlFor="description" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="6"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
            placeholder="Provide detailed description of your feedback..."
          />
        </div>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '12px 24px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading 
              ? (isEditing ? 'Updating...' : 'Submitting...') 
              : (isEditing ? 'Update Feedback' : 'Submit Feedback')
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;
