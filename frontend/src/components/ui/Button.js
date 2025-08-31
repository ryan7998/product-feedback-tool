import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'default',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed';
  
            const variants = {
            primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg transition-all duration-200 w-full',
            success: 'bg-green-600 text-white shadow-md hover:bg-green-700 hover:shadow-lg transition-colors w-full',
            secondary: 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200',
            outline: 'bg-transparent text-purple-600 border-2 border-purple-600 hover:bg-purple-600 hover:text-white',
            text: 'bg-transparent text-purple-600 hover:text-purple-700 hover:bg-purple-50'
          };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    default: 'px-4 py-2.5 text-base w-full',
    lg: 'px-6 py-3 text-lg w-full'
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
