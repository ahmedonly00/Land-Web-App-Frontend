import React from 'react';

const PlaceholderImage = ({ width = 400, height = 300, text = 'No Image', className = '' }) => {
  return (
    <div 
      className={`bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center ${className}`}
      style={{ width: '100%', height: '100%', minHeight: `${height}px` }}
    >
      <div className="text-center p-4">
        <div className="text-primary-300 text-lg font-medium">{text}</div>
      </div>
    </div>
  );
};

export default PlaceholderImage;
