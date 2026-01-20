/**
 * Select Component - Dropdown chọn
 * Thiết kế to, dễ chọn cho người cao tuổi
 */

import React from 'react';

const Select = React.forwardRef(({ 
  label,
  error,
  icon,
  options = [],
  placeholder = 'Chọn một mục...',
  size = 'large',
  fullWidth = true,
  hint,
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
      
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400 pointer-events-none">
            {icon}
          </span>
        )}
        
        <select
          ref={ref}
          className={`
            ${sizeClasses[size]}
            ${widthClass}
            ${icon ? 'pl-14' : ''}
            ${error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-primary-400'}
            border-2 rounded-xl
            focus:outline-none focus:ring-2
            transition-all
            appearance-none
            bg-white
            cursor-pointer
          `}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option 
              key={option.value || option.id} 
              value={option.value || option.id}
            >
              {option.icon ? `${option.icon} ` : ''}{option.label || option.name}
            </option>
          ))}
        </select>
        
        {/* Arrow icon */}
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400 pointer-events-none">
          ▼
        </span>
      </div>
      
      {hint && !error && (
        <p className="mt-2 text-lg text-gray-500">{hint}</p>
      )}
      
      {error && (
        <p className="mt-2 text-lg text-red-600 flex items-center gap-2">
          <span>⚠️</span> {error}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
