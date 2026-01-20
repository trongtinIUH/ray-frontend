/**
 * Modal Component - Dialog popup
 * Thiết kế to, dễ đọc cho người cao tuổi
 */

import React from 'react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'medium', // 'small', 'medium', 'large', 'full'
  showCloseButton = true
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    small: 'max-w-sm',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    full: 'max-w-full mx-4'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className={`${sizeClasses[size]} w-full bg-white rounded-2xl shadow-2xl relative transform transition-all`}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b-2 border-gray-100">
              {title && (
                <h2 className="text-2xl font-bold text-gray-800">
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Đóng"
                >
                  <span className="text-2xl text-gray-500">✕</span>
                </button>
              )}
            </div>
          )}
          
          {/* Body */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
