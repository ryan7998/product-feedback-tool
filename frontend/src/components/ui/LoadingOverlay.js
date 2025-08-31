import React from 'react';
import Loader from './Loader';

const LoadingOverlay = ({ 
  isLoading, 
  text = 'Loading...', 
  variant = 'ring', 
  size = 'xl',
  backdrop = true,
  className = '' 
}) => {
  if (!isLoading) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}>
      {backdrop && (
        <div className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm"></div>
      )}
      <div className="relative z-10">
        <Loader variant={variant} size={size} text={text} />
      </div>
    </div>
  );
};

export default LoadingOverlay;
