// Alternative version using theme context
// src/components/layout/BottomRightBar.tsx
import React from 'react';
import { Search, User, Settings, Sun, Moon } from 'lucide-react';
import { useAppSelector, useTheme } from '@/hooks';
import { useNavigate } from 'react-router-dom';

interface BottomRightBarProps {
  onOpenSearch?: () => void;
}

export const BottomRightBar: React.FC<BottomRightBarProps> = ({ onOpenSearch }) => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleAdminClick = () => {
    navigate('/admin');
  };

  const { isDark, toggle } = useTheme(); 

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`rounded-full shadow-lg px-4 py-3 flex items-center gap-2 transition-all duration-300 ${
        isDark 
          ? 'bg-gray-800/90 backdrop-blur-sm border border-gray-700' 
          : 'bg-white/90 backdrop-blur-sm border border-gray-200'
      }`}>
        {/* Theme Toggle Button - Always visible */}
        <button 
          onClick={toggle}
          className={`p-2 rounded-full ${
            isDark 
              ? 'hover:bg-gray-700 text-gray-300' 
              : 'hover:bg-gray-100 text-gray-700'
          } transition-colors`}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? (
            <Sun className="text-yellow-400" size={20} />
          ) : (
            <Moon size={20} />
          )}
        </button>
        
        {/* Show additional options only when user is logged in */}
        {user && (
          <>
            {/* Divider */}
            <div className={`h-6 w-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            
            {/* Search Button */}
            {onOpenSearch && (
              <button 
                onClick={onOpenSearch}
                className={`p-2 rounded-full ${
                  isDark 
                    ? 'hover:bg-gray-700 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-700'
                } transition-colors`}
                aria-label="Open search"
              >
                <Search size={20} />
              </button>
            )}
            
            {/* Divider */}
            <div className={`h-6 w-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>

            {/* Profile Button */}
            <button 
              onClick={handleProfileClick}
              className={`p-2 rounded-full ${
                isDark 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-700'
              } transition-colors`}
              aria-label="View profile"
            >
              <User size={20} />
            </button>
            
            {/* Admin Panel Button - Only for admins */}
            {user.isAdmin && (
              <button 
                onClick={handleAdminClick}
                className={`p-2 rounded-full ${
                  isDark 
                    ? 'hover:bg-gray-700 text-primary-400' 
                    : 'hover:bg-gray-100 text-primary-600'
                } transition-colors`}
                aria-label="Admin panel"
              >
                <Settings size={20} />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};