
// src/components/layout/Header.tsx
import React  from 'react';
import { Container, LogOut, User, Search } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { logout } from '@/store/slices/authSlice';

interface HeaderProps {
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <Container className="text-primary-600 dark:text-primary-400" size={24} />
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                <a href="/">Container</a>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {/* Search Button - Only show when user is logged in */}
            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenSearch}
                className="flex items-center space-x-1"
              >
                <Search size={16} />
                <span className="hidden sm:inline">Search</span>
              </Button>
            )}
            
            {user && (
              <div className="flex items-center space-x-3">
                {/* <div className="flex items-center space-x-2">
                  <User size={16} className="text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {user.username}
                  </span>
                  {user.isAdmin && (
                    <span className="px-2 py-1 text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full">
                      Admin
                    </span>
                  )}
                </div> */}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-1"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};