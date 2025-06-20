import Image from 'next/image';

interface ItemGridProps {
  items: Array<{
    id: number;
    label: string;
    brand: string;
    name: string;
    imageUrl: string;
  }>;
  isExpanded: boolean;
  onToggle: () => void;
}

export function ItemGrid({ items, isExpanded, onToggle }: ItemGridProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-bold text-white">Items</h3>
        <button
          className="text-xs text-primary font-semibold focus:outline-none"
          onClick={onToggle}
        >
          {isExpanded ? 'less' : 'more'}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-[#222] rounded-xl p-3 flex flex-row items-center"
          >
            <Image
              src={item.imageUrl}
              alt={item.name}
              width={72}
              height={72}
              className="rounded object-contain bg-white flex-shrink-0"
              style={{ width: 72, height: 72 }}
            />
            <div className="ml-3 flex flex-col">
              <span className="text-xs text-gray-400 mb-1">{item.label}</span>
              <span className="text-sm font-bold text-white">{item.brand}</span>
              <span className="text-xs text-white">{item.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 