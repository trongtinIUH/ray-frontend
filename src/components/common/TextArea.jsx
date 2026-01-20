/**
 * TextArea Component - Ô nhập văn bản nhiều dòng
 * Thiết kế to, dễ nhập cho người cao tuổi
 */

import React from 'react';

const TextArea = React.forwardRef(({ 
  label,
  error,
  rows = 4,
  size = 'large',
  fullWidth = true,
  hint,
  maxLength,
  showCount = false,
  value = '',
  ...props 
}, ref) => {
  const sizeClasses = {
    medium: 'px-4 py-3 text-lg',
    large: 'px-5 py-4 text-xl',
    xl: 'px-6 py-5 text-2xl'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <div className={`${widthClass} mb-4`}>
      {label && (
        <label className="block text-xl font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <textarea
        ref={ref}
        rows={rows}
        value={value}
        maxLength={maxLength}
        className={`
          ${sizeClasses[size]}
          ${widthClass}
          ${error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-primary-400'}
          border-2 rounded-xl
          focus:outline-none focus:ring-2
          transition-all
          placeholder:text-gray-400
          resize-none
        `}
        {...props}
      />
      
      <div className="flex justify-between items-center mt-2">
        {hint && !error && (
          <p className="text-lg text-gray-500">{hint}</p>
        )}
        
        {error && (
          <p className="text-lg text-red-600 flex items-center gap-2">
            <span>⚠️</span> {error}
          </p>
        )}
        
        {showCount && maxLength && (
          <p className={`text-lg ${value.length >= maxLength ? 'text-red-500' : 'text-gray-500'}`}>
            {value.length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;
