/**
 * Loading Spinner Component - Hiển thị trạng thái đang tải
 * Thiết kế to, rõ ràng cho người cao tuổi
 */

import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  text = 'Đang tải...', 
  fullScreen = false 
}) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-16 h-16',
    large: 'w-24 h-24'
  };

  const textSizes = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div 
        className={`${sizeClasses[size]} border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin`}
      />
      {text && (
        <p className={`${textSizes[size]} text-gray-600 font-medium`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/90 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
