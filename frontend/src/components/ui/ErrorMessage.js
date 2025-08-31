import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ErrorMessage = ({ message, className = '' }) => {
  if (!message) return null;
  
  return (
            <div className={`bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 ${className}`}>
          <AlertTriangle className="w-5 h-5 text-red-600" />
          {message}
        </div>
  );
};

export default ErrorMessage;
