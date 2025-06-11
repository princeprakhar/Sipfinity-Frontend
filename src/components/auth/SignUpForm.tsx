// src/components/auth/SignUpForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
// import type { SignUpCredentials } from '@/types';
import { Mail, Lock, User, Phone, Shield } from 'lucide-react';

const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  phone_number: z.string().min(1, 'Phone number is required'),
  role: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Update the type to match backend expectations
type SignUpFormData = {
  email: string;
  password: string;
  confirmPassword: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  role: string;
};

interface SignUpFormProps {
  onSubmit: (data: Omit<SignUpFormData, 'confirmPassword'>) => void;
  isLoading: boolean;
  error?: string;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
  onSubmit,
  isLoading,
  error,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      first_name: '',
      last_name: '',
      phone_number: '',
      role: 'user',
    },
  });

  const handleFormSubmit = (data: SignUpFormData) => {
    // Remove confirmPassword before sending to backend
    const { confirmPassword, ...backendData } = data;
    onSubmit(backendData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Create Account
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Join us today! Create your account to get started.
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

        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              {...register('first_name')}
              type="text"
              placeholder="First name"
              className="pl-10"
              error={errors.first_name?.message}
            />
          </div>

          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              {...register('last_name')}
              type="text"
              placeholder="Last name"
              className="pl-10"
              error={errors.last_name?.message}
            />
          </div>
        </div>

        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            {...register('phone_number')}
            type="tel"
            placeholder="Enter your phone number"
            className="pl-10"
            error={errors.phone_number?.message}
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            {...register('password')}
            type="password"
            placeholder="Create a password"
            className="pl-10"
            error={errors.password?.message}
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            {...register('confirmPassword')}
            type="password"
            placeholder="Confirm your password"
            className="pl-10"
            error={errors.confirmPassword?.message}
          />
        </div>

        <div className="flex items-center space-x-3">
          <input
            {...register('role')}
            type="checkbox"
            id="isAdminSignUp"
            value="admin"
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            onChange={(e) => {
              // Set role based on checkbox state
              const roleValue = e.target.checked ? 'admin' : 'user';
              register('role').onChange({ target: { value: roleValue } });
            }}
          />
          <label
            htmlFor="isAdminSignUp"
            className="flex items-center text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
          >
            <Shield size={16} className="mr-1" />
            Register as Administrator
          </label>
        </div>
      </div>

      <Button
        type="submit"
        loading={isLoading}
        className="w-full"
        size="lg"
      >
        Create Account
      </Button>
    </form>
  );
};