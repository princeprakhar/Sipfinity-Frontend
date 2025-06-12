// src/pages/ValidateTokenPage.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Key, CheckCircle } from 'lucide-react';
import { ResetPasswordModal } from '@/components/auth/ResetPasswordModal';
import { validateResetToken, resetPassword, clearError, clearResetState } from '@/store/slices/authSlice';
import { type RootState } from '@/store';
import { useAppDispatch } from '@/hooks';

const tokenValidationSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
});

type TokenValidationData = {
  token: string;
};

export const ValidateTokenPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userEmail = searchParams.get('email');
  const [validatedToken, setValidatedToken] = useState<string>('');
  const [showResetModal, setShowResetModal] = useState(false);

  // Redux selectors
  const { isLoading, error, tokenValidated } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TokenValidationData>({
    resolver: zodResolver(tokenValidationSchema),
    defaultValues: {
      token: '',
    },
  });

  // Auto-fill token from URL if present
  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setValue('token', tokenFromUrl);
    }
  }, [searchParams, setValue]);

  // Handle token validation success
  useEffect(() => {
    if (tokenValidated && validatedToken) {
      setShowResetModal(true);
    }
  }, [tokenValidated, validatedToken]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleFormSubmit = async (data: TokenValidationData) => {
    try {
      await dispatch(validateResetToken(data.token)).unwrap();
      setValidatedToken(data.token);
    } catch (error) {
      console.error('Token validation failed:', error);
    }
  };

  const handleResetSubmit = async (data: { new_password: string }) => {
    try {
      await dispatch(resetPassword({
        token: validatedToken,
        new_password: data.new_password,
      })).unwrap();
      
      setShowResetModal(false);
      dispatch(clearResetState());
      navigate('/login?message=Password reset successful');
    } catch (error) {
      console.error('Password reset failed:', error);
    }
  };

  const handleCloseResetModal = () => {
    setShowResetModal(false);
    dispatch(clearError());
  };

  const handleBackToLogin = () => {
    dispatch(clearResetState());
    navigate('/login');
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="text-green-500" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Validate Reset Token
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              We've sent a reset token to{' '}
              {userEmail ? (
                <span className="font-medium">{userEmail}</span>
              ) : (
                'your email'
              )}
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Enter the token below to proceed with password reset.
            </p>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

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

            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={handleBackToLogin}
                className="flex-1"
              >
                Back to Login
              </Button>
              <Button
                type="submit"
                loading={isLoading}
                className="flex-1"
              >
                Validate Token
              </Button>
            </div>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Didn't receive the token?{' '}
              <button
                onClick={() => navigate('/forgot-password')}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Request a new one
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Reset Password Modal */}
      <ResetPasswordModal
        isOpen={showResetModal}
        onClose={handleCloseResetModal}
        onSubmit={handleResetSubmit}
        isLoading={isLoading}
        error={error || undefined}
        userEmail={userEmail || ""}
      />
    </>
  );
};