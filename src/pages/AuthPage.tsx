// src/pages/AuthPage.tsx
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { WelcomeModal } from '@/components/auth/WelcomeModal';
import { SignInForm } from '@/components/auth/SignInForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { ForgotPasswordContainer } from '@/components/auth/ForgotPasswordContainer';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { signIn, signUp,   clearError } from '@/store/slices/authSlice';
import type { SignInCredentials, SignUpCredentials } from '@/types';
import type { RootState } from '@/store';

type AuthView = 'welcome' | 'signin' | 'signup';

export const AuthPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<AuthView>('welcome');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { isAuthenticated, isLoading, error } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/items" replace />;
  }

  const handleSignIn = async (credentials: SignInCredentials) => {
    try {
      const result = await dispatch(signIn(credentials));
      if (signIn.fulfilled.match(result)) {
        toast.success('Welcome back!');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      // Error is handled by the effect above
    }
  };

  const handleSignUp = async (credentials: SignUpCredentials) => {
    try {
      const result = await dispatch(signUp(credentials));
      if (signUp.fulfilled.match(result)) {
        toast.success('Account created successfully!');
      }
    } catch (error) {
      // Error is handled by the effect above
    }
  };

 

  

  const handleCloseForgotPassword = () => {
    setShowForgotPassword(false);
    // Clear any existing errors when closing
    dispatch(clearError());
  };

  const renderContent = () => {
    switch (currentView) {
      case 'welcome':
        return (
          <WelcomeModal
            isOpen={true}
            onClose={() => {}}
            onSignIn={() => setCurrentView('signin')}
            onSignUp={() => setCurrentView('signup')}
          />
        );
      
      case 'signin':
        return (
          <div className="max-w-md mx-auto">
            <div className="p-8">
              <SignInForm
                onSubmit={handleSignIn}
                onForgotPassword={() => setShowForgotPassword(true)}
                isLoading={isLoading}
                error={error || undefined}
              />
              <div className="mt-6 text-center">
                <button
                  onClick={() => setCurrentView('signup')}
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium transition-colors"
                >
                  Don't have an account? Sign up
                </button>
              </div>
              <div className="mt-4 text-center">
                <button
                  onClick={() => setCurrentView('welcome')}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm transition-colors"
                >
                  ← Back to welcome
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'signup':
        return (
          <div className="max-w-md mx-auto">
            <div className="p-8">
              <SignUpForm
                onSubmit={handleSignUp}
                isLoading={isLoading}
                error={error || undefined}
              />
              <div className="mt-6 text-center">
                <button
                  onClick={() => setCurrentView('signin')}
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium transition-colors"
                >
                  Already have an account? Sign in
                </button>
              </div>
              <div className="mt-4 text-center">
                <button
                  onClick={() => setCurrentView('welcome')}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm transition-colors"
                >
                  ← Back to welcome
                </button>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4">
        {renderContent()}
      </div>
      
      <ForgotPasswordContainer
        isOpen={showForgotPassword}
        onClose={handleCloseForgotPassword}
      />
    </div>
  );
};