import { NoImagePopupProps } from './types';
import SearchIcon from '@mui/icons-material/Search';

export function NoImagePopup({
  item,
  isVisible,
  position = 'left',
}: NoImagePopupProps) {
  if (!isVisible) return null;

  return (
    <div
      className={`absolute ${
        position === 'left' ? 'right-full' : 'left-full'
      } top-0 p-4`}
    >
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 w-[280px]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
            <SearchIcon className="w-5 h-5 text-white/60" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-white/80 font-medium">
              {item.info.name}
            </div>
            <div className="text-xs text-white/40">
              {item.info.description}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40">포인트</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-[10px] text-black font-bold">P</span>
              </div>
              <span className="text-xs text-white">{item.info.points}</span>
            </div>
          </div>
          <button className="w-full h-8 bg-white/10 hover:bg-white/15 transition-colors rounded text-xs text-white">
            아이템 정보 제공
          </button>
        </div>
      </div>
    </div>
  );
} 