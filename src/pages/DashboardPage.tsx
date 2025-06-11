// src/pages/DashboardPage.tsx
import React from 'react';
import { Package, BarChart3, Users, Settings } from 'lucide-react';
import { useAppSelector } from '@/hooks';

export const DashboardPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  const stats = [
    {
      name: 'Total Items',
      value: '2,547',
      change: '+4.5%',
      icon: Package,
      changeType: 'positive' as const,
    },
    {
      name: 'Low Stock',
      value: '23',
      change: '-12%',
      icon: BarChart3,
      changeType: 'negative' as const,
    },
    {
      name: 'Categories',
      value: '12',
      change: '+2',
      icon: Users,
      changeType: 'positive' as const,
    },
    {
      name: 'Active Users',
      value: '8',
      change: '+1',
      icon: Settings,
      changeType: 'positive' as const,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.username}! 👋
        </h1>
        <p className="text-primary-100">
          Here's what's happening with your inventory today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.name}
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-2">
                  {stat.value}
                </p>
              </div>
              <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full">
                <stat.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span
                className={`text-sm font-medium ${
                  stat.changeType === 'positive'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                vs last month
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center space-x-3">
                <Package className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <span className="text-gray-900 dark:text-gray-100">Add New Item</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <span className="text-gray-900 dark:text-gray-100">Generate Report</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <span className="text-gray-900 dark:text-gray-100">Manage Users</span>
              </div>
            </button>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Item "Laptop Dell XPS" was added
              </span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Low stock alert for "Office Chairs"
              </span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                User "john.doe" logged in
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder for your existing prototype */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Container Prototype Integration
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Your existing prototype from{' '}
          <a 
            href="https://container-rose.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary-600 dark:text-primary-400 hover:underline"
        >
          container-rose.vercel.app
        </a>
        {' '}will be integrated here. This is where your inventory management features will be displayed.
      </p>
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">
          Your existing prototype components will be embedded here after authentication.
        </p>
      </div>
    </div>
  </div>
);
};