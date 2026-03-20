'use client';

import { useMemo } from 'react';

interface MasonryGridProps {
  items: React.ReactNode[];
  columns?: number;
}

export function MasonryGrid({ items, columns = 3 }: MasonryGridProps) {
  // Round-robin distribute items into columns for correct L-to-R reading order
  const columnItems = useMemo(() => {
    const cols: React.ReactNode[][] = Array.from({ length: columns }, () => []);
    items.forEach((item, index) => {
      cols[index % columns].push(item);
    });
    return cols;
  }, [items, columns]);

  return (
    <div className="flex gap-4">
      {columnItems.map((col, colIndex) => (
        <div key={colIndex} className="flex flex-1 flex-col gap-4">
          {col}
        </div>
      ))}
    </div>
  );
}
