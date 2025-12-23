import React from 'react';

// Component Button to, dễ nhấn cho người lớn tuổi
const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'large',
  icon,
  fullWidth = false,
  disabled = false,
  ...props 
}) => {
  const baseClasses = 'rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 min-h-[44px] min-w-[44px]';
  
  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-md active:scale-95',
    warning: 'bg-warning-500 hover:bg-warning-600 text-white shadow-md active:scale-95',
    danger: 'bg-danger-500 hover:bg-danger-600 text-white shadow-md active:scale-95',
    outline: 'border-2 border-primary-500 text-primary-600 hover:bg-primary-50 active:scale-95',
  };
  
  const sizes = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${disabledClass}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="text-xl">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export default Button;
