/**
 * Header Component - App Header
 * Đơn giản, rõ ràng
 */

import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ title, showBack = false, onBack, rightElement }) => {
  return (
    <header className="sticky top-0 bg-white border-b-2 border-gray-100 shadow-sm z-30">
      <div className="flex items-center justify-between px-4 py-4 max-w-4xl mx-auto">
        {/* Left - Back button or Logo */}
        <div className="flex items-center gap-3">
          {showBack ? (
            <button
              onClick={onBack || (() => window.history.back())}
              className="p-2 hover:bg-gray-100 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Quay lại"
            >
              <span className="text-2xl">←</span>
            </button>
          ) : (
            <Link to="/" className="flex items-center gap-2">
              <span className="text-4xl">🌾</span>
            </Link>
          )}
          
          <h1 className="text-2xl font-bold text-gray-800">
            {title || 'FarmRay'}
          </h1>
        </div>

        {/* Right - Custom element or notification */}
        <div className="flex items-center gap-2">
          {rightElement || (
            <button 
              className="p-2 hover:bg-gray-100 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center relative"
              aria-label="Thông báo"
            >
              <span className="text-2xl">🔔</span>
              {/* Notification badge */}
              <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
