interface ListProgressProps {
  total: number;
  current: number;
}

export function ListProgress({ total, current }: ListProgressProps) {
  const progress = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="px-4 py-4 border-t border-white/10">
      <div className="flex justify-between items-center mb-2">
        <div className="text-xs text-white/60">Progress</div>
        <div className="text-xs text-white/60">
          {current} to Decoded
        </div>
      </div>
      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-white/80 transition-all duration-300 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
} 