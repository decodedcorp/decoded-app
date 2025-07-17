export function RelatedStylingLoader() {
  return (
    <div className="w-full py-8">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-700 rounded w-1/4"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
} 