// src/components/layout/Layout.tsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { BottomRightBar } from './BottomRightBar';
import { SearchModal } from '@/components/ui/SearchModal';

export const Layout: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  
  const handleOpenSearch = () => {
    setIsSearchOpen(true);
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header onOpenSearch={handleOpenSearch} />
      {/* <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> */}
      <main>
        <Outlet />
      </main>
      <BottomRightBar 
        onOpenSearch={handleOpenSearch}
      />
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={handleCloseSearch}
      />
    </div>
  );
};