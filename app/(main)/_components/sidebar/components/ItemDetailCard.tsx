import Image from 'next/image';

interface ItemDetailCardProps {
  item: {
    id: number;
    label: string;
    brand: string;
    name: string;
    imageUrl: string;
  };
}

export function ItemDetailCard({ item }: ItemDetailCardProps) {
  return (
    <div className="flex flex-col items-center bg-[#181818] rounded-2xl p-6 shadow">
      <div className="flex items-center gap-2 mb-2">
        <Image 
          src="/images/brand/prada.png" 
          alt="brand" 
          width={32} 
          height={32} 
          className="rounded-full" 
        />
        <span className="text-lg font-bold text-white">{item.brand}</span>
      </div>
      <div className="text-xs text-gray-400 font-bold uppercase">{item.label}</div>
      <div className="text-xl font-extrabold text-white text-center">{item.name}</div>
      <div className="text-xs text-white/70 mt-2 text-center">
        Prada's signature utilitarian cut meets Y2K cool<br />
        — these low-rise pants bring sharp tailoring to early-2000s
      </div>
    </div>
  );
} 