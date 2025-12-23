import React from 'react';

// Component Card để hiển thị thông tin
const Card = ({ 
  title, 
  children, 
  icon,
  bgColor = 'bg-white',
  borderColor = 'border-gray-200',
  ...props 
}) => {
  return (
    <div 
      className={`${bgColor} ${borderColor} border-2 rounded-xl shadow-lg p-6 mb-4`}
      {...props}
    >
      {title && (
        <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-gray-100">
          {icon && <span className="text-3xl">{icon}</span>}
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        </div>
      )}
      <div className="text-gray-700">
        {children}
      </div>
    </div>
  );
};

export default Card;
