// src/components/ui/Modal.tsx
import React from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import { useTheme } from '@/hooks';
import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlayClick = true,
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in"
      onClick={handleOverlayClick}
    >
      <div
        className={clsx(
          'w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl animate-slide-up',
          sizeClasses[size]
        )}
      >
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        )}
        <div className={clsx('p-6', !title && 'pt-6')}>
          {!title && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};










interface Modal2Props {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string; // Added to support the className prop used in ProductModal
}

const Modal2: React.FC<Modal2Props> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'lg',
  className
}) => {
  const { theme } = useTheme();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className={`
          relative bg-white dark:bg-gray-900 rounded-lg shadow-xl 
          ${maxWidthClasses[maxWidth]} 
          ${className || 'w-full mx-4'}
          max-h-[90vh] overflow-hidden
        `}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Header */}
        <div className={`
          flex items-center justify-between p-6 border-b 
          ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
        `}>
          <h2 className={`
            text-lg font-semibold 
            ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
          `}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className={`
              p-1 rounded-md transition-colors
              ${theme === 'dark' 
                ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-800' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }
            `}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal2;