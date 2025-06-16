// components/admin/BulkActionsBar.tsx
import React from 'react';
import { Trash2, X } from 'lucide-react';
import { useTheme } from '@/hooks';

interface BulkActionsBarProps {
  selectedCount: number;
  onDelete: () => void;
  onClearSelection: () => void;
}

const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  onDelete,
  onClearSelection
}) => {
  const { theme } = useTheme();

return (
  <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} p-4 mb-6`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
        </span>
        <button
          onClick={onClearSelection}
          className={`text-sm ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
        >
          Clear selection
        </button>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={onDelete}
          className="inline-flex items-center px-3 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Selected
        </button>
      </div>
    </div>
  </div>
);
};

export default BulkActionsBar;