/**
 * Navigation Bar Component - Bottom Navigation
 * Thiết kế mobile-first, nút to dễ bấm với Font Awesome icons
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Trang chủ', icon: 'fa-solid fa-house', activeColor: 'from-emerald-400 to-green-500' },
  { path: '/weather', label: 'Thời tiết', icon: 'fa-solid fa-cloud-sun', activeColor: 'from-sky-400 to-blue-500' },
  { path: '/chat', label: 'Hỏi AI', icon: 'fa-solid fa-robot', activeColor: 'from-violet-400 to-purple-500' },
  { path: '/alerts', label: 'Cảnh báo', icon: 'fa-solid fa-bell', activeColor: 'from-amber-400 to-orange-500' },
  { path: '/profile', label: 'Tôi', icon: 'fa-solid fa-user', activeColor: 'from-pink-400 to-rose-500' }
];

const BottomNavigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40">
      {/* Glass background */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-lg border-t border-gray-200/50" />
      
      <div className="relative flex justify-around items-center max-w-lg mx-auto py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center py-2 px-3 min-w-[68px] transition-all duration-300"
            >
              {/* Icon container */}
              <div className={`
                relative flex items-center justify-center
                w-12 h-12 rounded-2xl mb-1
                transition-all duration-300
                ${isActive 
                  ? `bg-gradient-to-r ${item.activeColor} shadow-lg scale-110` 
                  : 'bg-gray-100 hover:bg-gray-200'
                }
              `}>
                <i className={`
                  ${item.icon} text-xl
                  ${isActive ? 'text-white' : 'text-gray-500'}
                  transition-colors duration-300
                `} />
                {/* Active indicator dot */}
                {isActive && (
                  <span className="absolute -bottom-1 w-1.5 h-1.5 bg-white rounded-full shadow-sm" />
                )}
              </div>
              
              {/* Label */}
              <span className={`
                text-xs font-semibold transition-colors duration-300
                ${isActive ? 'text-gray-800' : 'text-gray-500'}
              `}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      
      {/* Safe area for iPhone */}
      <div className="h-safe-area-inset-bottom bg-white/80" />
    </nav>
  );
};

export default BottomNavigation;
