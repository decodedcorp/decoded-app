import { cn } from '@/lib/utils/style';
import { Activity } from '../utils/types';
import { ProvideButton } from './provide-button';
import { getRelativeTime } from '../utils/time';

interface ActivityCardProps {
  activity: Activity;
}

export function ActivityCard({ activity: { data } }: ActivityCardProps) {
  return (
    <div
      className={cn(
        'flex gap-4 p-3 rounded-xl transition-all duration-200',
        'hover:bg-white/5',
        'border border-transparent',
        'hover:border-zinc-700/50'
      )}
    >
      {/* 요청 이미지 */}
      <div
        className={cn(
          'w-16 h-16 rounded-xl overflow-hidden',
          'border border-zinc-700/50',
          'bg-zinc-900/50'
        )}
      >
        <img
          src={data.image_url}
          alt={`Image ${data.image_doc_id}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* 요청 정보 */}
      <div className="flex-1">
        <div className="flex items-center justify-between h-full">
          <div className="space-y-1">
            <p className="text-sm text-zinc-300 leading-snug">
              <span className="text-[#EAFD66] font-medium">
                {data.item_len}
              </span>
              <span className="ml-1">개의 아이템이 요청되었습니다</span>
            </p>
            <p className="text-xs text-zinc-500">
              {data.at ? getRelativeTime(data.at) : '알 수 없음'}
            </p>
          </div>

          <ProvideButton imageDocId={data.image_doc_id} />
        </div>
      </div>
    </div>
  );
}
