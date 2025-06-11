// src/components/ui/SearchModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setSearchQuery } from '@/store/slices/itemSlice';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state) => state.items.searchQuery);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      // Replace this with your actual search API call
      // const results = await searchAPI(query);
      dispatch(setSearchQuery(query));
      // Mock search results for demonstration
      const mockResults = [
        { id: 1, title: `Result for "${query}" - Item 1`, type: 'page' },
        { id: 2, title: `Result for "${query}" - Item 2`, type: 'document' },
        { id: 3, title: `Result for "${query}" - Item 3`, type: 'user' },
      ].filter(() => Math.random() > 0.3); // Random filtering for demo

      setTimeout(() => {
        setSearchResults(mockResults);
        setIsLoading(false);
      }, 300);
    } catch (error) {
      console.error('Search error:', error);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setSearchQuery(value));

    // Debounce search
    const timeoutId = setTimeout(() => {
      handleSearch(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleResultClick = (result: any) => {
    // Handle result click - navigate to result page
    console.log('Clicked result:', result);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-start justify-center p-4 pt-16">
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-xl transition-all">
          {/* Search Input */}
          <div className="flex items-center border-b border-gray-200 dark:border-gray-700 px-4 py-3">
            <Search className="h-5 w-5 text-gray-400 mr-3" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleInputChange}
              className="flex-1 border-0 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none text-lg"
            />
            <button
              onClick={onClose}
              className="ml-3 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto mb-2"></div>
                Searching...
              </div>
            ) : searchQuery && searchResults.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                No results found for "{searchQuery}"
              </div>
            ) : searchQuery ? (
              <div className="py-2">
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700"
                  >
                    <div className="flex items-center">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {result.title}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                          {result.type}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                Start typing to search...
              </div>
            )}
          </div>

          {/* Quick Actions or Recent Searches (Optional) */}
          {!searchQuery && (
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick Actions</p>
              <div className="space-y-1">
                <button className="w-full text-left px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  View Profile
                </button>
                <button className="w-full text-left px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};