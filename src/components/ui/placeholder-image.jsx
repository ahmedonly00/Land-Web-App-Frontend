import React from 'react';

const PlaceholderImage = ({ text = 'No Image', className = '', textClassName = 'text-gray-400', ...props }) => {
  return (
    <div 
      className={`flex flex-col items-center justify-center bg-gray-100 rounded-lg ${className}`}
      {...props}
    >
      <svg 
        className="w-12 h-12 mb-2 text-gray-300" 
        fill="currentColor" 
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          fillRule="evenodd" 
          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" 
          clipRule="evenodd" 
        />
      </svg>
      <span className={`text-sm ${textClassName}`}>{text}</span>
    </div>
  );
};

export default PlaceholderImage;
