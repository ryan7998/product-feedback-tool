import React from 'react';

const AuthHeader = ({ 
  title = 'Product Feedback Tool',
  subtitle,
  description,
  className = '' 
}) => {
  return (
            <div className={`text-center mb-8 ${className}`}>
          <div className="text-2xl font-bold text-blue-800 mb-3">
            {title}
          </div>
          {subtitle && (
            <div className="text-lg text-gray-700 mb-2">
              {subtitle}
            </div>
          )}
          {description && (
            <div className="text-sm text-gray-600 leading-relaxed">
              {description}
            </div>
          )}
        </div>
  );
};

export default AuthHeader;
