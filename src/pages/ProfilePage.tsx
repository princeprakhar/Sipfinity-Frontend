import React from 'react';
import { ProfileDetails } from '@/components/profile/ProfileDetails';

export const ProfilePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ProfileDetails />
    </div>
  );
};