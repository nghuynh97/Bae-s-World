"use client";

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
      className="group relative w-full overflow-hidden rounded-lg cursor-pointer"
      style={{ aspectRatio: `${width}/${height}` }}
    >
      <img
        src={imageUrl}
        alt={title}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.02]"
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-end p-4">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
          <p className="text-sm font-bold">{title}</p>
          <p className="text-xs opacity-80">{category}</p>
        </div>
      </div>
    </button>
  );
}
