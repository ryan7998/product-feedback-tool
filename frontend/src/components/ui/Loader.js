import React from 'react';

const Loader = ({ 
  variant = 'spinner', 
  size = 'default', 
  text = '', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const renderSpinner = () => (
    <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600`}></div>
  );

  const renderDots = () => (
    <div className="flex space-x-1">
      <div className={`${sizeClasses.sm} bg-indigo-600 rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
      <div className={`${sizeClasses.sm} bg-indigo-600 rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
      <div className={`${sizeClasses.sm} bg-indigo-600 rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
    </div>
  );

  const renderPulse = () => (
    <div className={`${sizeClasses[size]} bg-indigo-600 rounded-full animate-pulse`}></div>
  );

  const renderRing = () => (
    <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 border-r-indigo-600 border-b-indigo-600`}></div>
  );

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'ring':
        return renderRing();
      case 'spinner':
      default:
        return renderSpinner();
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      {renderLoader()}
      {text && (
        <div className="text-sm text-gray-600 font-medium text-center">
          {text}
        </div>
      )}
    </div>
  );
};

export default Loader;
