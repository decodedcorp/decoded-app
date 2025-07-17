interface ExpandableTextProps {
  text: string;
  isExpanded: boolean;
  onToggle: () => void;
}

export function ExpandableText({ text, isExpanded, onToggle }: ExpandableTextProps) {
  return (
    <div className="relative">
      <p
        className={
          `text-base text-white/80 whitespace-pre-line mb-2 transition-all duration-200 ` +
          (isExpanded ? '' : 'line-clamp-2')
        }
        style={
          isExpanded
            ? {}
            : {
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }
        }
      >
        {text}
      </p>
      <button
        className="text-xs text-primary font-semibold focus:outline-none absolute right-0 top-0"
        onClick={onToggle}
      >
        {isExpanded ? 'less' : 'more'}
      </button>
    </div>
  );
} 