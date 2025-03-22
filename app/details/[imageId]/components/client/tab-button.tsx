'use client';

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export function TabButton({ isActive, onClick, children }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 py-4 px-6 relative w-full justify-center ${
        isActive ? 'text-white' : 'text-gray-500'
      }`}
    >
      {children}
    </button>
  );
} 