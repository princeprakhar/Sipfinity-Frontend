// src/components/auth/ForgotPasswordEmailModal.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Mail } from 'lucide-react';

const forgotPasswordEmailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordEmailData = {
  email: string;
};

interface ForgotPasswordEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ForgotPasswordEmailData) => void;
  isLoading: boolean;
  error?: string;
}

export const ForgotPasswordEmailModal: React.FC<ForgotPasswordEmailModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  error,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordEmailData>({
    resolver: zodResolver(forgotPasswordEmailSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Forgot Password" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="text-center mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Enter your email address and we'll send you a reset token to create a new password.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            {...register('email')}
            type="email"
            placeholder="Enter your email address"
            className="pl-10"
            error={errors.email?.message}
          />
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
            Send Reset Token
          </Button>
        </div>
      </form>
    </Modal>
  );
};