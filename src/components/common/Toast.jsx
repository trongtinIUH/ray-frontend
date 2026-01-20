/**
 * Toast Notification Component
 * Thông báo popup to, rõ ràng
 */

import React, { useEffect } from 'react';

const Toast = ({ 
  message, 
  type = 'info', // 'success', 'error', 'warning', 'info'
  duration = 4000,
  onClose,
  visible = false
}) => {
  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        onClose && onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  if (!visible) return null;

  const typeStyles = {
    success: {
      bg: 'bg-green-100',
      border: 'border-green-400',
      text: 'text-green-800',
      icon: '✅'
    },
    error: {
      bg: 'bg-red-100',
      border: 'border-red-400',
      text: 'text-red-800',
      icon: '❌'
    },
    warning: {
      bg: 'bg-yellow-100',
      border: 'border-yellow-400',
      text: 'text-yellow-800',
      icon: '⚠️'
    },
    info: {
      bg: 'bg-blue-100',
      border: 'border-blue-400',
      text: 'text-blue-800',
      icon: 'ℹ️'
    }
  };

  const style = typeStyles[type];

  return (
    <div className="fixed top-4 left-4 right-4 z-50 animate-slide-down">
      <div 
        className={`${style.bg} ${style.border} ${style.text} border-2 rounded-xl p-5 shadow-xl flex items-center gap-4`}
      >
        <span className="text-3xl">{style.icon}</span>
        <p className="text-xl font-medium flex-1">{message}</p>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          aria-label="Đóng thông báo"
        >
          <span className="text-2xl">✕</span>
        </button>
      </div>
    </div>
  );
};

export default Toast;
