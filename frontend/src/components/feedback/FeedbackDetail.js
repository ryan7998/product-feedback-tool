import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import config from '../../config/config';
import MentionsInput from '../common/MentionsInput';
import { Loader } from '../../components/ui';
import { ArrowLeft, MessageSquare, Bug, Lightbulb, Zap, MessageCircle, FileText } from 'lucide-react';

const FeedbackDetail = ({ feedback, onBack, onEdit }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (feedback) {
      fetchComments();
    }
  }, [feedback, fetchComments]);

  const fetchComments = useCallback(async () => {
    if (!feedback) return;
    
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.COMMENTS.LIST(feedback.id)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch comments');
      }

      setComments(result || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [feedback]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    setError('');

    try {
      const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.COMMENTS.CREATE(feedback.id)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          content: newComment
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit comment');
      }

      setNewComment('');
      fetchComments(); // Refresh comments
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmittingComment(false);
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

  /**
   * Parse comment content and highlight @mentions
   */
  const parseCommentContent = (content) => {
    // Split content by @mentions and preserve the @mentions
    // Use the same regex as the backend for consistency
    const parts = content.split(/(@[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/);
    
    return parts.map((part, index) => {
      // Check if this part is a @mention (starts with @ and contains proper name capitalization)
      if (part.match(/^@[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*$/)) {
        // This is a mention - style it specially
        return (
          <span
            key={index}
            className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm font-medium cursor-pointer"
            title={`Mentioned user: ${part.substring(1)}`}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  /**
   * Get mentioned users display text
   */
  const getMentionsText = (mentions) => {
    if (!mentions || mentions.length === 0) return null;
    
    if (mentions.length === 1) {
      return `Mentioned 1 user`;
    } else {
      return `Mentioned ${mentions.length} users`;
    }
  };

  if (!feedback) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-gray-600">No feedback selected</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="max-w-4xl mx-auto p-8 relative">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to List
          </button>
        </div>

        {/* Feedback Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {getCategoryIcon(feedback.category)} {feedback.title}
              </h1>
              <p className="text-gray-600 leading-relaxed text-lg">
                {feedback.description}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <div className="flex gap-4 items-center">
              <span className="text-gray-600">
                By: <strong className="text-gray-800">{feedback.user?.name || 'Unknown User'}</strong>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {feedback.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
              <span className="text-gray-600 text-sm">
                Created: {formatDate(feedback.created_at)}
              </span>
              {feedback.updated_at !== feedback.created_at && (
                <span className="text-gray-600 text-sm">
                  Updated: {formatDate(feedback.updated_at)}
                </span>
              )}
            </div>

            {user?.id === feedback.user_id && (
              <button
                onClick={() => onEdit(feedback)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                Edit Feedback
              </button>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-indigo-600" />
            Comments ({comments.length})
          </h3>

          {/* Add Comment Form */}
          <div className="mb-8 pb-6 border-b border-gray-200">
            <form onSubmit={handleSubmitComment}>
              <div className="mb-4">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                  Add a Comment
                </label>
                <div className="mb-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1 mb-1">
                    <Lightbulb className="w-3 h-3 text-yellow-500" />
                    <span>Tip: Type @ to search and mention users. Names must start with capital letters (e.g., @John Smith)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-3 h-3 text-blue-500" />
                    <span>Formatting: Use **bold**, *italic*, and `code` for better expression</span>
                  </div>
                </div>
                
                {/* Formatting Help */}
                <div className="bg-gray-50 p-3 rounded-lg mb-3 text-xs text-gray-600">
                  <strong>Formatting:</strong> <span className="text-indigo-600">**bold**</span> → <strong>bold</strong> | <span className="text-indigo-600">*italic*</span> → <em>italic</em> | <span className="text-indigo-600">`code`</span> → <code className="bg-gray-200 px-1 rounded">code</code>
                </div>
                
                <MentionsInput
                  id="comment"
                  value={newComment}
                  onChange={setNewComment}
                  placeholder="Share your thoughts... Use **bold**, *italic*, `code`, and @mentions"
                  rows={3}
                  disabled={submittingComment}
                />
              </div>
              <button
                type="submit"
                disabled={submittingComment || !newComment.trim()}
                className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 min-w-[140px] ${
                  submittingComment || !newComment.trim() 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {submittingComment ? (
                  <>
                    <Loader variant="spinner" size="sm" />
                    Posting...
                  </>
                ) : (
                  'Post Comment'
                )}
              </button>
            </form>
          </div>

          {/* Comments List */}
          {loading ? (
            <div className="text-center py-8">
              <Loader variant="dots" size="lg" text="Loading comments..." />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              Error: {error}
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              No comments yet. Be the first to comment!
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map(comment => (
                <div key={comment.id} className="pb-6 border-b border-gray-100 last:border-b-0">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <strong className="text-gray-800">{comment.user?.name || 'Unknown User'}</strong>
                      <span className="text-sm text-gray-500">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Mentions Info */}
                  {comment.mentions && comment.mentions.length > 0 && (
                    <div className="mb-3 text-sm text-gray-500 italic">
                      {getMentionsText(comment.mentions)}
                    </div>
                  )}
                  
                  {/* Comment Content with Parsed Mentions */}
                  <div className="text-gray-700 leading-relaxed">
                    {comment.formatted_content ? (
                      <div 
                        dangerouslySetInnerHTML={{ 
                          __html: comment.formatted_content 
                        }}
                        className="prose prose-sm max-w-none"
                      />
                    ) : (
                      parseCommentContent(comment.content)
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackDetail;
