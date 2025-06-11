// src/components/auth/SignInForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { type SignInCredentials } from '@/types';
import { Mail, Lock, Shield } from 'lucide-react';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  isAdmin: z.boolean().default(false),
});

interface SignInFormProps {
  onSubmit: (data: SignInCredentials) => void;
  onForgotPassword: () => void;
  isLoading: boolean;
  error?: string;
}

export const SignInForm: React.FC<SignInFormProps> = ({
  onSubmit,
  onForgotPassword,
  isLoading,
  error,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignInCredentials>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
      isAdmin: false,
    },
  });

  const isAdmin = watch('isAdmin');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Sign In
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome back! Please sign in to your account.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            {...register('email')}
            type="email"
            placeholder="Enter your email"
            className="pl-10"
            error={errors.email?.message}
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            {...register('password')}
            type="password"
            placeholder="Enter your password"
            className="pl-10"
            error={errors.password?.message}
          />
        </div>

        <div className="flex items-center space-x-3">
          <input
            {...register('isAdmin')}
            type="checkbox"
            id="isAdmin"
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <label
            htmlFor="isAdmin"
            className="flex items-center text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
          >
            <Shield size={16} className="mr-1" />
            Sign in as Administrator
          </label>
        </div>
      </div>

      <Button
        type="submit"
        loading={isLoading}
        className="w-full"
        size="lg"
      >
        Sign In
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium transition-colors"
        >
          Forgot your password?
        </button>
      </div>
    </form>
  );
};