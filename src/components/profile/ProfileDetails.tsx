import React, { useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  AlertCircle,
  Calendar,
  Clock,
  Hash
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { Button } from '@/components/ui/Button';
import { fetchUserProfile } from '@/store/slices/authSlice';

export const ProfileDetails: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, error } = useAppSelector((state) => state.auth);
  const { theme } = useAppSelector((state) => state.theme);
  const loading = !user && !error;

  useEffect(() => {
    if (!user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // const getStatusColor = (isAdmin: boolean) => {
  //   return isAdmin ? 'text-purple-600' : 'text-blue-600';
  // };

  const getStatusBgColor = (isAdmin: boolean) => {
    return isAdmin 
      ? 'bg-purple-100 text-purple-800' 
      : 'bg-blue-100 text-blue-800';
  };

  // Loading state
  if (loading) {
    return (
      <div className={`rounded-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } shadow-sm p-6`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`rounded-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } shadow-sm p-6`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-500 mb-4">Failed to load profile</p>
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            <Button 
              variant="primary" 
              onClick={() => dispatch(fetchUserProfile())}
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // No user data
  if (!user) {
    return (
      <div className={`rounded-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } shadow-sm p-6`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No profile data available</p>
          </div>
        </div>
      </div>
    );
  }

  const handleEditProfile = () => {
    console.log('Edit profile clicked');
  };

  const handleChangePassword = () => {
    console.log('Change password clicked');
  };

  const handleRefreshProfile = () => {
    dispatch(fetchUserProfile());
  };

  return (
    <div className={`rounded-lg ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    } shadow-sm p-6`}>
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-4 rounded-full ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gradient-to-br from-blue-50 to-indigo-100'
            }`}>
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-primary-600" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {user.firstName} {user.lastName}
              </h2>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  getStatusBgColor(user.isAdmin)
                }`}>
                  <Shield className="w-3 h-3 mr-1" />
                  {user.isAdmin ? 'Admin' : 'User'}
                </span>
                <span className="text-sm text-gray-500 capitalize">
                  {user.role}
                </span>
              </div>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleRefreshProfile}
            className="hover:bg-gray-100"
          >
            Refresh
          </Button>
        </div>

        {/* Profile Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
            
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <Hash className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">User ID</p>
                <p className="font-medium">#{user.id}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <Mail className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            {user.phoneNumber && (
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <Phone className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium">{user.phoneNumber}</p>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <Shield className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium capitalize">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Account Information</h3>
            
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <Calendar className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium">{formatDate(user.createdAt)}</p>
              </div>
            </div>

            {user.updatedAt && (
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <Clock className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-medium">{formatDate(user.updatedAt)}</p>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <User className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Username</p>
                <p className="font-medium">{user.username}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-4 border-t">
          <Button 
            variant="primary" 
            onClick={handleEditProfile}
            className="flex-1 sm:flex-none"
          >
            Edit Profile
          </Button>
          <Button 
            variant="secondary" 
            onClick={handleChangePassword}
            className="flex-1 sm:flex-none"
          >
            Change Password
          </Button>
        </div>
      </div>
    </div>
  );
};