// src/components/auth/ForgotPasswordModal.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { type ResetPasswordData } from '@/types';
import { Key, Lock, CheckCircle } from 'lucide-react';

const forgotPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ForgotPasswordFormData = {
  token: string;
  newPassword: string;
  confirmPassword: string;
};

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ResetPasswordData) => void;
  isLoading: boolean;
  error?: string;
  userEmail?: string; // To show which email the token was sent to
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  error,
  userEmail,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      token: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: ForgotPasswordFormData) => {
    const {  newPassword, token } = data;
    onSubmit({ token: token, new_password: newPassword });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Reset Password" size="md">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <CheckCircle className="text-green-500" size={24} />
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            We've sent a reset token to {userEmail ? <span className="font-medium">{userEmail}</span> : 'your email'}.
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
            Enter the token and your new password below.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="relative">
            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              {...register('token')}
              type="text"
              placeholder="Enter reset token from email"
              className="pl-10"
              error={errors.token?.message}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              {...register('newPassword')}
              type="password"
              placeholder="Enter new password"
              className="pl-10"
              error={errors.newPassword?.message}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              {...register('confirmPassword')}
              type="password"
              placeholder="Confirm new password"
              className="pl-10"
              error={errors.confirmPassword?.message}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isLoading}
            className="flex-1"
          >
            Reset Password
          </Button>
        </div>
      </form>
    </Modal>
  );
};