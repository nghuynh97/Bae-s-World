'use client';

interface QuiltedGridProps {
  children: React.ReactNode;
}

export function QuiltedGrid({ children }: QuiltedGridProps) {
  return (
    <div className="ig-grid grid grid-cols-3 gap-0.5">
      {children}
    </div>
  );
}
