// src/components/ui/ThemeToggle.tsx
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { Button } from './Button';

export const ThemeToggle: React.FC = () => {
  const { theme, toggle } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      className="p-2"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </Button>
  );
};