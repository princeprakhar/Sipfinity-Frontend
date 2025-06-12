// components/items/AdminBanner.tsx
import React from 'react';
import { useAppSelector } from '../../hooks';
import { ShieldCheckIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';



const AdminBanner: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { theme } = useAppSelector((state) => state.theme);
  const navigate = useNavigate();


  if (user && typeof user === 'object' && 'role' in user && user.role !== 'admin') {
    return null;
  }

  const handleGoToAdmin = () => {
    // Navigate to admin page - adjust the route as needed
    navigate("/admin");
    // or if using react-router: navigate('/admin');
  };

  return (
    <div className={`sticky top-0 z-50 ${
      theme === 'dark' 
        ? 'bg-gradient-to-r from-purple-900/90 to-blue-900/90 border-purple-700/50' 
        : 'bg-gradient-to-r from-purple-100/90 to-blue-100/90 border-purple-200'
    } backdrop-blur-sm border-b transition-all duration-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              theme === 'dark' 
                ? 'bg-purple-800/50 text-purple-300' 
                : 'bg-purple-200/50 text-purple-700'
            }`}>
              <ShieldCheckIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className={`font-semibold text-sm ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Admin Access
              </h3>
              <p className={`text-xs ${
                theme === 'dark' ? 'text-purple-200' : 'text-purple-600'
              }`}>
                You have administrative privileges
              </p>
            </div>
          </div>
          
          <button
            onClick={handleGoToAdmin}
            className={`group flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 transform hover:scale-105 ${
              theme === 'dark'
                ? 'bg-purple-700 hover:bg-purple-600 text-white shadow-lg hover:shadow-purple-500/25'
                : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-purple-500/25'
            }`}
          >
            <span>Go to Admin Page</span>
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminBanner;