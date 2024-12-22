import { NoImageButtonProps } from './types';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

export function NoImageButton({ onClick, className }: NoImageButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`group flex flex-col items-center gap-8 ${className}`}
    >
      <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 whitespace-nowrap">
        <SearchIcon className="w-4 h-4 text-white/80" />
      </div>
      <div className="w-4 h-4 rounded-full bg-black/60 flex items-center justify-center transition-colors duration-200">
        <AddIcon className="w-3 h-3 text-white/80" />
      </div>
    </button>
  );
} 