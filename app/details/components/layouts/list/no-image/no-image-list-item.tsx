import { NoImageListItemProps } from './types';

export function NoImageListItem({ item }: NoImageListItemProps) {
  return (
    <div className="flex w-full gap-3 mb-3">
      {/* Image area */}
      <div className="w-[90px] h-[90px] bg-white/5 flex items-center justify-center shrink-0">
        <span className="text-xs text-white/40">NO IMAGE</span>
      </div>

      {/* Info area */}
      <div className="flex flex-col justify-center flex-1 min-w-0">
        <div className="text-xs text-white/40 mb-3">{item.info.category}</div>
        <button className="w-full h-8 border border-white/10 hover:bg-white/5 transition-colors rounded flex items-center justify-center gap-2">
          <div className="flex items-center gap-1">
            {/* point 버튼 svg 대체 */}
            <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-[10px] text-black font-bold">P</span>
            </div>
            <span className="text-xs text-white">100</span>
          </div>
          <span className="text-xs text-white">Provide Information</span>
        </button>
      </div>
    </div>
  );
}
