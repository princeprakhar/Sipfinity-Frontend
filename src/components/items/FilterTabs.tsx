// components/items/FilterTabs.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/hooks';

interface FilterTabsProps {
  categories: string[] | { data: string[] };
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  isLoading?: boolean;
}

const FilterTabs: React.FC<FilterTabsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const { theme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Extract the actual categories array from the API response
  const categoryList = Array.isArray(categories) 
    ? categories 
    : categories?.data || [];

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

  // Generate dynamic colors for categories
  const getCategoryColor = (category: string, index: number) => {
    // Pre-defined color palettes for better visual consistency
    const colorPalettes = [
      // Blue family
      { bg: 'bg-blue-500', bgHover: 'hover:bg-blue-600', bgLight: 'bg-blue-100', text: 'text-white', textLight: 'text-blue-800', bgDark: 'bg-blue-800', bgDarkHover: 'hover:bg-blue-700' },
      // Purple family
      { bg: 'bg-purple-500', bgHover: 'hover:bg-purple-600', bgLight: 'bg-purple-100', text: 'text-white', textLight: 'text-purple-800', bgDark: 'bg-purple-800', bgDarkHover: 'hover:bg-purple-700' },
      // Green family
      { bg: 'bg-green-500', bgHover: 'hover:bg-green-600', bgLight: 'bg-green-100', text: 'text-white', textLight: 'text-green-800', bgDark: 'bg-green-800', bgDarkHover: 'hover:bg-green-700' },
      // Orange family
      { bg: 'bg-orange-500', bgHover: 'hover:bg-orange-600', bgLight: 'bg-orange-100', text: 'text-white', textLight: 'text-orange-800', bgDark: 'bg-orange-800', bgDarkHover: 'hover:bg-orange-700' },
      // Pink family
      { bg: 'bg-pink-500', bgHover: 'hover:bg-pink-600', bgLight: 'bg-pink-100', text: 'text-white', textLight: 'text-pink-800', bgDark: 'bg-pink-800', bgDarkHover: 'hover:bg-pink-700' },
      // Indigo family
      { bg: 'bg-indigo-500', bgHover: 'hover:bg-indigo-600', bgLight: 'bg-indigo-100', text: 'text-white', textLight: 'text-indigo-800', bgDark: 'bg-indigo-800', bgDarkHover: 'hover:bg-indigo-700' },
      // Teal family
      { bg: 'bg-teal-500', bgHover: 'hover:bg-teal-600', bgLight: 'bg-teal-100', text: 'text-white', textLight: 'text-teal-800', bgDark: 'bg-teal-800', bgDarkHover: 'hover:bg-teal-700' },
      // Red family
      { bg: 'bg-red-500', bgHover: 'hover:bg-red-600', bgLight: 'bg-red-100', text: 'text-white', textLight: 'text-red-800', bgDark: 'bg-red-800', bgDarkHover: 'hover:bg-red-700' },
      // Yellow family
      { bg: 'bg-yellow-500', bgHover: 'hover:bg-yellow-600', bgLight: 'bg-yellow-100', text: 'text-white', textLight: 'text-yellow-800', bgDark: 'bg-yellow-800', bgDarkHover: 'hover:bg-yellow-700' },
      // Cyan family
      { bg: 'bg-cyan-500', bgHover: 'hover:bg-cyan-600', bgLight: 'bg-cyan-100', text: 'text-white', textLight: 'text-cyan-800', bgDark: 'bg-cyan-800', bgDarkHover: 'hover:bg-cyan-700' },
      // Emerald family
      { bg: 'bg-emerald-500', bgHover: 'hover:bg-emerald-600', bgLight: 'bg-emerald-100', text: 'text-white', textLight: 'text-emerald-800', bgDark: 'bg-emerald-800', bgDarkHover: 'hover:bg-emerald-700' },
      // Rose family
      { bg: 'bg-rose-500', bgHover: 'hover:bg-rose-600', bgLight: 'bg-rose-100', text: 'text-white', textLight: 'text-rose-800', bgDark: 'bg-rose-800', bgDarkHover: 'hover:bg-rose-700' },
    ];

    // Generate a consistent color based on category name hash
    const hash = category.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    // Use both hash and index for better distribution
    const colorIndex = (Math.abs(hash) + index) % colorPalettes.length;
    return colorPalettes[colorIndex];
  };

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
        {/* <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4"> */}
          {/* All Categories Button */}
          <button
            onClick={() => onSelectCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              !selectedCategory
                ? 'bg-gray-700 text-white shadow-md transform scale-105'
                : theme === 'dark'
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
            }`}
          >
            All
          </button>

          {/* Category Buttons */}
          {categoryList.map((category: string, index: number) => {
            const isSelected: boolean = selectedCategory === category;
            const colors = getCategoryColor(category, index);

            return (
              <button
                key={index}
                onClick={() => onSelectCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap transform ${
                  isSelected
                    ? `${colors.bg} ${colors.text} shadow-lg scale-105 ${colors.bgHover} border-${colors.bgDark} hover:scale-105 whitespace-nowrap`
                    : theme === 'dark'
                    ? `${colors.bgDark} text-gray-300 ${colors.bgDarkHover} border border-gray-700 hover:scale-105`
                    : `${colors.bgLight} ${colors.textLight} hover:bg-opacity-80 border border-gray-200 hover:scale-105 hover:shadow-md`
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      {/* </div> */}

      {/* Spacer to prevent content jump when filter becomes fixed */}
      {isScrolled && <div className="h-16" />}
    </div>
  );
};

export default FilterTabs;