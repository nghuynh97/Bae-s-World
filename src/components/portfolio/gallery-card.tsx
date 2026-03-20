'use client';

interface GalleryCardProps {
  title: string;
  category: string;
  imageUrl: string;
  width: number;
  height: number;
  onClick: () => void;
}

export function GalleryCard({
  title,
  category,
  imageUrl,
  width,
  height,
  onClick,
}: GalleryCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative w-full cursor-pointer overflow-hidden rounded-lg"
      style={{ aspectRatio: `${width}/${height}` }}
    >
      <img
        src={imageUrl}
        alt={title}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.02]"
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 flex items-end bg-black/0 p-4 transition-colors duration-300 group-hover:bg-black/30">
        <div className="text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <p className="text-sm font-bold">{title}</p>
          <p className="text-xs opacity-80">{category}</p>
        </div>
      </div>
    </button>
  );
}
