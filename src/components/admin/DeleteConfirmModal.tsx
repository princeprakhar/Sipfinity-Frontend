// components/admin/DeleteConfirmModal.tsx
import React from 'react';
import Modal2 from '../ui/Modal';
import { AlertTriangle } from 'lucide-react';
import { useTheme } from '@/hooks';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemCount: number;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemCount
}) => {
  const { theme } = useTheme();

  return (
    <Modal2 isOpen={isOpen} onClose={onClose} title="Confirm Delete" maxWidth="md">
      <div className="text-center">
        <div className={`mx-auto flex items-center justify-center w-12 h-12 rounded-full ${theme === 'dark' ? 'bg-red-900' : 'bg-red-100'} mb-4`}>
          <AlertTriangle className={`w-6 h-6 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} />
        </div>
        
        <h3 className={`text-lg font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Delete {itemCount} Product{itemCount !== 1 ? 's' : ''}?
        </h3>
        
        <p className={`text-sm mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          This action cannot be undone. The selected product{itemCount !== 1 ? 's' : ''} will be permanently removed from your catalog.
        </p>
        
        <div className="flex justify-center space-x-3">
          <button
            onClick={onClose}
            className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
              theme === 'dark'
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal2>
  );
};

export default DeleteConfirmModal;