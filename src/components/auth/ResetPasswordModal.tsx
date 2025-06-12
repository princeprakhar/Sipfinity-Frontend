// src/components/auth/ResetPasswordModal.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Lock, Shield } from 'lucide-react';

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  token: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = {
  newPassword: string;
  confirmPassword: string;
  token: string; // This will be passed from the parent component
};

export type ResetPasswordModalData = {
  token: string;
  new_password: string;
};

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ResetPasswordModalData) => void;
  isLoading: boolean;
  error?: string;
  userEmail?: string;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
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
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
      token: '', // This will be set by the parent component when opening the modal
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: ResetPasswordFormData) => {
    onSubmit({ token: data.token, new_password: data.newPassword });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Reset Password" size="md">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <Shield className="text-blue-500" size={24} />
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Token validated successfully! Now create your new password.
          </p>
          {userEmail && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
              for <span className="font-medium">{userEmail}</span>
            </p>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
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