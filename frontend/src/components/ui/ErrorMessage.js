import React from 'react';

const ErrorMessage = ({ message, className = '' }) => {
  if (!message) return null;
  
  return (
            <div className={`bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 ${className}`}>
          <span>⚠️</span>
          {message}
        </div>
  );
};

export default ErrorMessage;
