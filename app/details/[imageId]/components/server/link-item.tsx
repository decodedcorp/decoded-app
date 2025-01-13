import { ChevronRight } from 'lucide-react';

interface LinkItemProps {
  url: string;
  label: string;
  description: string;
}

export function LinkItem({ url, label, description }: LinkItemProps) {
  const domain = new URL(url).hostname.replace('www.', '');

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-4 rounded-lg bg-zinc-900/50 hover:bg-zinc-800/50 transition-all hover:scale-[1.02] group"
    >
      <div className="flex-1">
        <span className="text-[10px] font-medium text-[#EAFD66]">
          {label.toUpperCase()}
        </span>
        <div className="text-sm font-medium text-zinc-300 group-hover:text-[#EAFD66] transition-colors">
          {domain}
        </div>
        <div className="text-xs text-zinc-500">{description}</div>
      </div>
      <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-[#EAFD66] transition-colors" />
    </a>
  );
} 