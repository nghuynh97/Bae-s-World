interface PhotoStripProps {
  items: Array<{ imageUrl: string; title: string }>;
}

export function PhotoStrip({ items }: PhotoStripProps) {
  if (items.length === 0) return null;

  return (
    <div className="flex gap-2 mt-8">
      {items.slice(0, 4).map((item, index) => (
        <a key={index} href="/">
          <img
            src={item.imageUrl}
            alt={item.title || ""}
            className="w-20 h-20 object-cover rounded-md"
          />
        </a>
      ))}
    </div>
  );
}
