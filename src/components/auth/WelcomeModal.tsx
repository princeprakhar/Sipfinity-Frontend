// src/components/auth/WelcomeModal.tsx
import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Container, UserPlus, LogIn } from 'lucide-react';

interface WelcomeModalProps {
isOpen: boolean;
onClose: () => void;
onSignIn: () => void;
onSignUp: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
isOpen,
onClose,
onSignIn,
onSignUp,
}) => {
return (
  <Modal isOpen={isOpen} onClose={onClose} size="md" closeOnOverlayClick={false}>
    <div className="text-center">
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-primary-100 dark:bg-primary-900 rounded-full">
          <Container size={48} className="text-primary-600 dark:text-primary-400" />
        </div>
      </div>
      
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Welcome to Container
      </h1>
      
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Your modern inventory management solution. Get started by signing in or creating a new account.
      </p>
      
      <div className="space-y-3">
        <Button
          onClick={onSignIn}
          className="w-full flex items-center justify-center gap-2"
          size="lg"
        >
          <LogIn size={20} />
          Sign In
        </Button>
        
        <Button
          onClick={onSignUp}
          variant="secondary"
          className="w-full flex items-center justify-center gap-2"
          size="lg"
        >
          <UserPlus size={20} />
          Create Account
        </Button>
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Secure authentication with JWT tokens
        </p>
      </div>
    </div>
  </Modal>
);
};