// src/components/auth/ForgotPasswordContainer.tsx
import React, { useState } from 'react';
import { ForgotPasswordEmailModal } from './ForgotPasswordEmailModal';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { type ResetPasswordData } from '@/types';

type ForgotPasswordStep = 'email' | 'reset';

interface ForgotPasswordContainerProps {
  isOpen: boolean;
  onClose: () => void;
  onForgotPassword: (email: string) => Promise<void>;
  onResetPassword: (data: ResetPasswordData) => Promise<void>;
  isLoading: boolean;
  error?: string;
}

export const ForgotPasswordContainer: React.FC<ForgotPasswordContainerProps> = ({
  isOpen,
  onClose,
  onForgotPassword,
  onResetPassword,
  isLoading,
  error,
}) => {
  const [currentStep, setCurrentStep] = useState<ForgotPasswordStep>('email');
  const [userEmail, setUserEmail] = useState<string>('');

  const handleEmailSubmit = async (data: { email: string }) => {
    try {
      await onForgotPassword(data.email);
      setUserEmail(data.email);
      setCurrentStep('reset');
    } catch (error) {
      // Error will be handled by parent component
      console.error('Failed to send reset token:', error);
    }
  };

  const handleResetSubmit = async (data: ResetPasswordData) => {
    try {
      await onResetPassword(data);
      // Success will be handled by parent component
      handleClose();
    } catch (error) {
      // Error will be handled by parent component
      console.error('Failed to reset password:', error);
    }
  };

  const handleClose = () => {
    setCurrentStep('email');
    setUserEmail('');
    onClose();
  };

  return (
    <>
      <ForgotPasswordEmailModal
        isOpen={isOpen && currentStep === 'email'}
        onClose={handleClose}
        onSubmit={handleEmailSubmit}
        isLoading={isLoading}
        error={error}
      />
      
      <ForgotPasswordModal
        isOpen={isOpen && currentStep === 'reset'}
        onClose={handleClose}
        onSubmit={handleResetSubmit}
        isLoading={isLoading}
        error={error}
        userEmail={userEmail}
      />
    </>
  );
};