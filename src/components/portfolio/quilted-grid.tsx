'use client';

interface QuiltedGridProps {
  children: React.ReactNode;
}

export function QuiltedGrid({ children }: QuiltedGridProps) {
  return (
    <div
      className="quilted-grid grid grid-cols-3 gap-1 max-md:grid-cols-2"
      style={{ gridAutoRows: '200px', gridAutoFlow: 'dense' }}
    >
      {children}
    </div>
  );
}
