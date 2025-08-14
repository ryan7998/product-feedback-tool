import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import config from '../../config/config';

const FeedbackList = ({ onViewFeedback, onEditFeedback, onDeleteFeedback }) => {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    category: ''
  });

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'bug_report', label: '🐛 Bug Report' },
    { value: 'feature_request', label: '💡 Feature Request' },
    { value: 'improvement', label: '⚡ Improvement' },
    { value: 'general', label: '💬 General Feedback' }
  ];

  useEffect(() => {
    fetchFeedback();
  }, [currentPage, filters]);

  const fetchFeedback = async () => {
    setLoading(true);
    setError('');

    try {
      let url = `${config.API_BASE_URL}${config.ENDPOINTS.FEEDBACK.LIST}?page=${currentPage}`;
      
      if (filters.category) url += `&category=${filters.category}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch feedback');
      }

      // Handle pagination object structure
      const feedbackData = result.data || [];
      if (!Array.isArray(feedbackData)) {
        console.error('Expected feedback data to be an array, got:', typeof feedbackData, feedbackData);
        setFeedback([]);
        setTotalPages(1);
        return;
      }

      setFeedback(feedbackData);
      setTotalPages(result.last_page || 1);
    } catch (error) {
      setError(error.message);
      setFeedback([]); // Ensure feedback is always an array
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleDelete = async (feedbackId) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) {
      return;
    }

    try {
      const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.FEEDBACK.DELETE(feedbackId)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to delete feedback');
      }

      // Refresh the list
      fetchFeedback();
    } catch (error) {
      setError(error.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryIcon = (category) => {
    const categoryMap = {
      bug_report: '🐛',
      feature_request: '💡',
      improvement: '⚡',
      general: '💬'
    };
    return categoryMap[category] || '📝';
  };

  if (loading && feedback.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '24px', color: '#666' }}>Loading feedback...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        backgroundColor: '#f8d7da', 
        color: '#721c24', 
        padding: '20px', 
        borderRadius: '4px', 
        margin: '20px',
        border: '1px solid #f5c6cb'
      }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{ marginBottom: '15px', color: '#333' }}>🔍 Filters</h3>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div style={{ marginBottom: '20px' }}>
        {feedback.map(item => (
          <div key={item.id} style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            marginBottom: '15px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ 
                  margin: '0 0 10px 0', 
                  color: '#333',
                  cursor: 'pointer'
                }} onClick={() => onViewFeedback(item)}>
                  {getCategoryIcon(item.category)} {item.title}
                </h3>
                <p style={{ 
                  margin: '0 0 10px 0', 
                  color: '#666',
                  lineHeight: '1.5'
                }}>
                  {item.description.length > 150 
                    ? `${item.description.substring(0, 150)}...` 
                    : item.description
                  }
                </p>
                
                {/* Comment Count */}
                {item.comments_count > 0 && (
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#007bff',
                    marginBottom: '10px'
                  }}>
                    💬 {item.comments_count} comment{item.comments_count !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
              
              <div style={{ textAlign: 'right', marginLeft: '20px' }}>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {formatDate(item.created_at)}
                </div>
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              paddingTop: '15px',
              borderTop: '1px solid #eee'
            }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#666' }}>
                  By: <strong>{item.user?.name || 'Unknown User'}</strong>
                </span>
                <span style={{ 
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  backgroundColor: '#e9ecef',
                  color: '#495057'
                }}>
                  {item.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => onViewFeedback(item)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  View
                </button>
                
                {user?.id === item.user_id && (
                  <>
                    <button
                      onClick={() => onEditFeedback(item)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '10px',
          marginTop: '30px'
        }}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            style={{
              padding: '8px 16px',
              backgroundColor: currentPage === 1 ? '#e9ecef' : '#007bff',
              color: currentPage === 1 ? '#6c757d' : 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Previous
          </button>
          
          <span style={{ 
            padding: '8px 16px',
            backgroundColor: '#e9ecef',
            color: '#495057',
            borderRadius: '4px'
          }}>
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 16px',
              backgroundColor: currentPage === totalPages ? '#e9ecef' : '#007bff',
              color: currentPage === totalPages ? '#6c757d' : 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Next
          </button>
        </div>
      )}

      {feedback.length === 0 && !loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '18px', color: '#666', marginBottom: '10px' }}>
            No feedback found
          </div>
          <div style={{ color: '#999' }}>
            {Object.values(filters).some(f => f) 
              ? 'Try adjusting your filters' 
              : 'Be the first to submit feedback!'
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackList;
