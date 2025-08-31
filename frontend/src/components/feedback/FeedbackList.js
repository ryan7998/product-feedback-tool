import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import config from '../../config/config';
import { LoadingSkeleton } from '../../components/ui';
import { Search, Bug, Lightbulb, Zap, MessageCircle, FileText, Eye, Edit, Trash2, MessageSquare } from 'lucide-react';

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
    { value: 'bug_report', label: 'Bug Report' },
    { value: 'feature_request', label: 'Feature Request' },
    { value: 'improvement', label: 'Improvement' },
    { value: 'general', label: 'General Feedback' }
  ];

  const fetchFeedback = useCallback(async () => {
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
  }, [currentPage, filters]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

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
      bug_report: <Bug className="w-5 h-5 text-red-500" />,
      feature_request: <Lightbulb className="w-5 h-5 text-yellow-500" />,
      improvement: <Zap className="w-5 h-5 text-blue-500" />,
      general: <MessageCircle className="w-5 h-5 text-green-500" />
    };
    return categoryMap[category] || <FileText className="w-5 h-5 text-gray-500" />;
  };

  if (loading && feedback.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Filters Skeleton */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 animate-pulse">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-300 rounded-xl"></div>
              <div className="h-6 bg-gray-300 rounded w-32"></div>
            </div>
            <div className="flex gap-6 flex-wrap items-end">
              <div className="min-w-[200px]">
                <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                <div className="h-12 bg-gray-300 rounded w-full"></div>
              </div>
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-lg">
                <div className="h-4 bg-gray-300 rounded w-64"></div>
              </div>
            </div>
          </div>
          
          {/* Feedback List Skeleton */}
          <div className="space-y-6">
            <LoadingSkeleton type="card" count={3} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="max-w-6xl mx-auto p-8 relative">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              Filter & Search
            </h3>
          </div>
          
          <div className="flex gap-6 flex-wrap items-end">
            <div className="min-w-[200px]">
              <div className="relative">
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg text-gray-700 bg-white cursor-pointer transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 appearance-none"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
                {/* Custom dropdown arrow */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-3 bg-indigo-50 rounded-lg border border-indigo-200">
              <span className="text-sm text-indigo-700 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-indigo-600" />
                Tip: Use filters to quickly find specific types of feedback
              </span>
            </div>
          </div>
        </div>

        {/* Feedback List */}
        <div className="space-y-6 mb-8">
          {feedback.map(item => (
            <div key={item.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 
                    className="text-xl font-bold text-gray-800 mb-3 cursor-pointer hover:text-indigo-600 transition-colors"
                    onClick={() => onViewFeedback(item)}
                  >
                    {getCategoryIcon(item.category)} {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-3">
                    {item.description.length > 150 
                      ? `${item.description.substring(0, 150)}...` 
                      : item.description
                    }
                  </p>
                  
                  {/* Comment Count */}
                  {item.comments_count > 0 && (
                    <div className="text-indigo-600 font-medium mb-3 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      {item.comments_count} comment{item.comments_count !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
                
                <div className="text-right ml-6">
                  <div className="text-sm text-gray-500">
                    {formatDate(item.created_at)}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="flex gap-3 items-center">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {item.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                  <span className="text-sm text-gray-600">
                    By: <strong className="text-gray-800">{item.user?.name || 'Unknown User'}</strong>
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => onViewFeedback(item)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  
                  {user?.id === item.user_id && (
                    <>
                      <button
                        onClick={() => onEditFeedback(item)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
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
          <div className="flex justify-center gap-3 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentPage === 1 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              Previous
            </button>
            
            <span className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentPage === totalPages 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              Next
            </button>
          </div>
        )}

        {feedback.length === 0 && !loading && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-xl text-gray-600 mb-3">
              No feedback found
            </div>
            <div className="text-gray-500">
              {Object.values(filters).some(f => f) 
                ? 'Try adjusting your filters' 
                : 'Be the first to submit feedback!'
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackList;
