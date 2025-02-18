interface HexBadgeProps {
  icon?: React.ReactNode;
  text?: string;
  className?: string;
  isActive?: boolean;
}

export function HexBadge({
  icon,
  text,
  className = '',
  isActive = false,
}: HexBadgeProps) {
  return (
    <div className={`relative w-32 h-32 group ${className}`}>
      {/* Background Glow Effect */}
      {isActive && (
        <div className="absolute inset-0 animate-pulse">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full text-[#EAFD66]/20"
          >
            <defs>
              <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.6" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </radialGradient>
            </defs>
            <polygon
              points="50 0, 93.3 25, 93.3 75, 50 100, 6.7 75, 6.7 25"
              fill="url(#glow)"
              className="blur-xl"
            />
          </svg>
        </div>
      )}

      {/* Main Hexagon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="hexFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2A2A2A" />
              <stop offset="100%" stopColor="#1A1A1A" />
            </linearGradient>
          </defs>
          <polygon
            points="50 0, 93.3 25, 93.3 75, 50 100, 6.7 75, 6.7 25"
            fill="url(#hexFill)"
            stroke={isActive ? '#EAFD66' : '#4A4A4A'}
            strokeWidth="3"
            strokeLinejoin="round"
            className="transition-all duration-300"
          />
        </svg>

        {/* Inner Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className={`
              transition-all duration-300 ease-out
              group-hover:scale-110
              ${isActive ? 'text-[#EAFD66]' : 'text-gray-500'}
            `}
          >
            {icon}
          </div>

          {text && (
            <div
              className={`
                mt-2 text-sm font-medium
                transition-all duration-300
                ${isActive ? 'text-[#EAFD66]' : 'text-gray-400'}
                group-hover:text-[#EAFD66]
                relative
                tracking-wide
              `}
            >
              {text}
            </div>
          )}
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon
            points="50 0, 93.3 25, 93.3 75, 50 100, 6.7 75, 6.7 25"
            fill="none"
            stroke="#EAFD66"
            strokeWidth="1"
            strokeLinejoin="round"
            className="opacity-20"
          />
        </svg>
      </div>
    </div>
  );
}
