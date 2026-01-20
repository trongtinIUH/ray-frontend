/**
 * Main Layout Component
 * Layout chính cho toàn app
 */

import React from 'react';
import Header from './Header';
import BottomNavigation from './BottomNavigation';

const MainLayout = ({ 
  children, 
  title, 
  showHeader = true,
  showNav = true,
  showBack = false,
  onBack,
  headerRight 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {showHeader && (
        <Header 
          title={title} 
          showBack={showBack}
          onBack={onBack}
          rightElement={headerRight}
        />
      )}
      
      <main className={`
        max-w-4xl mx-auto px-4 py-4
        ${showNav ? 'pb-24' : 'pb-4'}
      `}>
        {children}
      </main>

      {showNav && <BottomNavigation />}
    </div>
  );
};

export default MainLayout;
