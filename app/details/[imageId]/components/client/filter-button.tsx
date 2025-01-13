'use client';

interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export function FilterButton({ label, isActive, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
        isActive
          ? 'bg-white/90 text-black'
          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700/80'
      }`}
    >
      {label}
    </button>
  );
}
