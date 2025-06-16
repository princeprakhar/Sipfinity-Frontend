// components/ui/MasonryGrid.tsx
import React from 'react';

interface MasonryGridProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  columns?: {
    default: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number;
}

const MasonryGrid = <T,>({ 
  items, 
  renderItem, 
  columns = { default: 1, sm: 2, lg: 3, xl: 4 },
  gap = 4 
}: MasonryGridProps<T>) => {
  const getColumnCount = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width >= 1280 && columns.xl) return columns.xl;
      if (width >= 1024 && columns.lg) return columns.lg;
      if (width >= 768 && columns.md) return columns.md;
      if (width >= 640 && columns.sm) return columns.sm;
    }
    return columns.default;
  };

  const [columnCount, setColumnCount] = React.useState(getColumnCount);

  React.useEffect(() => {
    const handleResize = () => {
      setColumnCount(getColumnCount());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getColumns = () => {
    const cols: T[][] = Array.from({ length: columnCount }, () => []);
    
    items.forEach((item, index) => {
      const columnIndex = index % columnCount;
      cols[columnIndex].push(item);
    });
    
    return cols;
  };

  const columns_array = getColumns();

  return (
    <div 
      className={`grid gap-${gap}`}
      style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}
    >
      {columns_array.map((column, columnIndex) => (
        <div key={columnIndex} className={`space-y-${gap}`}>
          {column.map((item, itemIndex) => (
            <div key={itemIndex}>
              {renderItem(item)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;