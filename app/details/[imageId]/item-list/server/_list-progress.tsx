interface ListProgressProps {
  value?: number;
  total?: number;
  current?: number;
}

export function ListProgress({ value, total, current }: ListProgressProps) {
  {
    /* Progress 70% to Decoded */
  }
  const progress: number = 50;
  const totalBars: number = 140;
  const displayedBars: number = Math.round((progress / 100) * totalBars);

  return (
    <div className="py-4 border-t border-white/10">
      <div className="flex flex-col gap-1">
        <span className="text-neutral-400 font-mono text-sm">Progress</span>
        <span className="text-primary text-xl font-mono tracking-wider">
          {progress}% to Decoded
        </span>
      </div>

      <div className="w-full overflow-hidden mt-2">
        <div className="flex h-[12px] gap-[1px]">
          {Array.from({ length: totalBars }, (_, index) => {
            const isActive = index < displayedBars;
            return (
              <div
                key={index}
                className={`
                  h-full w-[2px] shrink-0
                  ${isActive ? 'bg-primary' : 'bg-neutral-800'}
                `}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
