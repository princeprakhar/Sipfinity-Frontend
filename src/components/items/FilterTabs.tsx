// components/items/FilterTabs.tsx
import React, { useEffect, useRef, useState } from 'react';
import { type Category, type TailwindColor } from '../../types';
import { useAppSelector } from '../../hooks';

interface FilterTabsProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

// Color class mappings for selected state
const selectedClassMap: Record<TailwindColor, string> = {
  pink: 'bg-pink-500 text-white shadow-md',
  amber: 'bg-amber-500 text-white shadow-md',
  green: 'bg-green-500 text-white shadow-md',
  emerald: 'bg-emerald-500 text-white shadow-md',
  blue: 'bg-blue-500 text-white shadow-md',
  indigo: 'bg-indigo-500 text-white shadow-md',
  violet: 'bg-violet-500 text-white shadow-md',
  purple: 'bg-purple-500 text-white shadow-md',
  yellow: 'bg-yellow-500 text-white shadow-md',
  red: 'bg-red-500 text-white shadow-md',
  rose: 'bg-rose-500 text-white shadow-md',
  fuchsia: 'bg-fuchsia-500 text-white shadow-md',
  lime: 'bg-lime-500 text-white shadow-md',
  teal: 'bg-teal-500 text-white shadow-md',
  sky: 'bg-sky-500 text-white shadow-md',
  cyan: 'bg-cyan-500 text-white shadow-md',
  slate: 'bg-slate-500 text-white shadow-md',
  orange: 'bg-orange-500 text-white shadow-md',
};

// Color class mappings for default state
const defaultClassMap: Record<TailwindColor, string> = {
  pink: 'bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200 dark:bg-pink-900/20 dark:text-pink-300 dark:hover:bg-pink-900/40 dark:border-pink-800/50',
  amber: 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:hover:bg-amber-900/40 dark:border-amber-800/50',
  green: 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/40 dark:border-green-800/50',
  emerald: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:hover:bg-emerald-900/40 dark:border-emerald-800/50',
  blue: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/40 dark:border-blue-800/50',
  indigo: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:hover:bg-indigo-900/40 dark:border-indigo-800/50',
  violet: 'bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:hover:bg-violet-900/40 dark:border-violet-800/50',
  purple: 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:hover:bg-purple-900/40 dark:border-purple-800/50',
  yellow: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:hover:bg-yellow-900/40 dark:border-yellow-800/50',
  red: 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/40 dark:border-red-800/50',
  rose: 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:hover:bg-rose-900/40 dark:border-rose-800/50',
  fuchsia: 'bg-fuchsia-50 text-fuchsia-700 hover:bg-fuchsia-100 border border-fuchsia-200 dark:bg-fuchsia-900/20 dark:text-fuchsia-300 dark:hover:bg-fuchsia-900/40 dark:border-fuchsia-800/50',
  lime: 'bg-lime-50 text-lime-700 hover:bg-lime-100 border border-lime-200 dark:bg-lime-900/20 dark:text-lime-300 dark:hover:bg-lime-900/40 dark:border-lime-800/50',
  teal: 'bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 dark:bg-teal-900/20 dark:text-teal-300 dark:hover:bg-teal-900/40 dark:border-teal-800/50',
  sky: 'bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 dark:bg-sky-900/20 dark:text-sky-300 dark:hover:bg-sky-900/40 dark:border-sky-800/50',
  cyan: 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100 border border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-300 dark:hover:bg-cyan-900/40 dark:border-cyan-800/50',
  slate: 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 dark:bg-slate-900/20 dark:text-slate-300 dark:hover:bg-slate-900/40 dark:border-slate-800/50',
  orange: 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:hover:bg-orange-900/40 dark:border-orange-800/50',
};

const FilterTabs: React.FC<FilterTabsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const { theme } = useAppSelector((state) => state.theme);
  const [isScrolled, setIsScrolled] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (filterRef.current) {
        const position = filterRef.current.getBoundingClientRect().top;
        setIsScrolled(position <= 0);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="mt-1 mx-1" ref={filterRef}>
      <div 
        className={`
          flex overflow-x-auto scrollbar-hide gap-2 
          transition-all duration-300
          ${isScrolled ? 
            'fixed top-0 left-0 right-0 z-50 py-3 px-4 backdrop-blur-md ' + 
            (theme === 'dark' ? 'bg-gray-900/80' : 'bg-white/80') +
            ' shadow-md' 
            : 'pb-2'
          }
        `}
      >
        {/* All Categories Button */}
        <button
          onClick={() => onSelectCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
            !selectedCategory
              ? 'bg-gray-700 text-white shadow-md'
              : theme === 'dark'
              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
          }`}
        >
          All
        </button>

        {/* Category Buttons */}
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          const buttonClasses = isSelected
            ? selectedClassMap[category.color]
            : defaultClassMap[category.color];

          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${buttonClasses}`}
            >
              {category.name}
            </button>
          );
        })}
      </div>
      
      {/* Spacer to prevent content jump when filter becomes fixed */}
      {isScrolled && <div className="h-16"></div>}
    </div>
  );
};

export default FilterTabs;