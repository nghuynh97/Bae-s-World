interface PhotoStripProps {
  items: Array<{ imageUrl: string; title: string }>;
}

export function PhotoStrip({ items }: PhotoStripProps) {
  if (items.length === 0) return null;

  return (
    <div className="mt-8 flex gap-2">
      {items.slice(0, 4).map((item, index) => (
        <a key={index} href="/">
          <img
            src={item.imageUrl}
            alt={item.title || ''}
            className="h-20 w-20 rounded-md object-cover"
          />
        </a>
      ))}
    </div>
  );
}
