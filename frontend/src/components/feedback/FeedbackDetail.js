import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import config from '../../config/config';

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
  }, [feedback]);

  const fetchComments = async () => {
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

      setComments(result.data || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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
      bug_report: '🐛',
      feature_request: '💡',
      improvement: '⚡',
      general: '💬'
    };
    return categoryMap[category] || '📝';
  };

  /**
   * Parse comment content and highlight @mentions
   */
  const parseCommentContent = (content) => {
    // Split content by @mentions and preserve the @mentions
    const parts = content.split(/(@\w+)/);
    
    return parts.map((part, index) => {
      if (part.match(/^@\w+$/)) {
        // This is a mention - style it specially
        return (
          <span
            key={index}
            style={{
              backgroundColor: '#e3f2fd',
              color: '#1976d2',
              padding: '2px 6px',
              borderRadius: '12px',
              fontSize: '0.9em',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
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
      return `Mentioned ${mentions[0].name}`;
    } else if (mentions.length === 2) {
      return `Mentioned ${mentions[0].name} and ${mentions[1].name}`;
    } else {
      return `Mentioned ${mentions[0].name} and ${mentions.length - 1} others`;
    }
  };

  if (!feedback) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '18px', color: '#666' }}>No feedback selected</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Back Button */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={onBack}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ← Back to List
        </button>
      </div>

      {/* Feedback Header */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: '0 0 15px 0', color: '#333' }}>
              {getCategoryIcon(feedback.category)} {feedback.title}
            </h1>
            <p style={{ 
              margin: '0 0 20px 0', 
              color: '#666',
              lineHeight: '1.6',
              fontSize: '16px'
            }}>
              {feedback.description}
            </p>
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          paddingTop: '20px',
          borderTop: '1px solid #eee'
        }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#666' }}>
              By: <strong>{feedback.user?.name || 'Unknown User'}</strong>
            </span>
            <span style={{ 
              padding: '4px 10px',
              borderRadius: '12px',
              fontSize: '12px',
              backgroundColor: '#e9ecef',
              color: '#495057'
            }}>
              {feedback.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
            <span style={{ fontSize: '14px', color: '#666' }}>
              Created: {formatDate(feedback.created_at)}
            </span>
            {feedback.updated_at !== feedback.created_at && (
              <span style={{ fontSize: '14px', color: '#666' }}>
                Updated: {formatDate(feedback.updated_at)}
              </span>
            )}
          </div>

          {user?.id === feedback.user_id && (
            <button
              onClick={() => onEdit(feedback)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Edit Feedback
            </button>
          )}
        </div>
      </div>

      {/* Comments Section */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{ marginBottom: '20px', color: '#333' }}>💬 Comments ({comments.length})</h3>

        {/* Add Comment Form */}
        <div style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
          <form onSubmit={handleSubmitComment}>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="comment" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Add a Comment
              </label>
              <div style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>
                💡 Tip: Use @username to mention other users (e.g., @John)
              </div>
              <textarea
                id="comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
                rows="3"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
                placeholder="Share your thoughts on this feedback... Use @username to mention others"
              />
            </div>
            <button
              type="submit"
              disabled={submittingComment || !newComment.trim()}
              style={{
                padding: '10px 20px',
                backgroundColor: submittingComment || !newComment.trim() ? '#e9ecef' : '#007bff',
                color: submittingComment || !newComment.trim() ? '#6c757d' : 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: submittingComment || !newComment.trim() ? 'not-allowed' : 'pointer'
              }}
            >
              {submittingComment ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        </div>

        {/* Comments List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '16px', color: '#666' }}>Loading comments...</div>
          </div>
        ) : error ? (
          <div style={{ 
            backgroundColor: '#f8d7da', 
            color: '#721c24', 
            padding: '15px', 
            borderRadius: '4px',
            border: '1px solid #f5c6cb'
          }}>
            Error: {error}
          </div>
        ) : comments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            No comments yet. Be the first to comment!
          </div>
        ) : (
          <div>
            {comments.map(comment => (
              <div key={comment.id} style={{ 
                padding: '20px 0',
                borderBottom: '1px solid #eee'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <strong style={{ color: '#333' }}>{comment.user?.name || 'Unknown User'}</strong>
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                </div>
                
                {/* Mentions Info */}
                {comment.mentions && comment.mentions.length > 0 && (
                  <div style={{ 
                    marginBottom: '8px',
                    fontSize: '12px',
                    color: '#666',
                    fontStyle: 'italic'
                  }}>
                    {getMentionsText(comment.mentions)}
                  </div>
                )}
                
                {/* Comment Content with Parsed Mentions */}
                <div style={{ 
                  color: '#555',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap'
                }}>
                  {parseCommentContent(comment.content)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackDetail;
