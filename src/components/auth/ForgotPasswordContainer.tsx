// src/components/auth/ForgotPasswordContainer.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ForgotPasswordEmailModal } from './ForgotPasswordEmailModal';
import { forgotPassword } from '@/store/slices/authSlice';
import { type RootState, type AppDispatch } from '@/store';

interface ForgotPasswordContainerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordContainer: React.FC<ForgotPasswordContainerProps> = ({
  isOpen,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const handleEmailSubmit = async (data: { email: string }) => {
    try {
      await dispatch(forgotPassword({ email: data.email })).unwrap();
      // Success will be handled by the modal component (redirect to validation page)
    } catch (error) {
      console.error('Failed to send reset email:', error);
      // Error is already in Redux state
    }
  };

  return (
    <ForgotPasswordEmailModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleEmailSubmit}
      isLoading={isLoading}
      error={error || undefined}
    />
  );
};