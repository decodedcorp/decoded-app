import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  showLink?: boolean;
}

const Logo = ({
  className,
  width = 100,
  height = 32,
  showLink = true,
}: LogoProps) => {
  const LogoContent = (
    <svg
      width={width}
      height={height}
      viewBox="0 0 400 120"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('hover:opacity-80 transition-opacity', className)}
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="#EAFD66"
        filter="url(#glow)"
        style={{
          fontFamily: 'Syncopate, sans-serif',
          fontSize: '52px',
          fontWeight: 'bold',
        }}
      >
        DEC
        <tspan fill="#EAFD66" opacity="0.8">
          O
        </tspan>
        DED
      </text>

      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="none"
        stroke="#EAFD66"
        strokeWidth="0.5"
        opacity="0.3"
        style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '56px',
          fontWeight: 'bold',
        }}
      >
        DECODED
      </text>
    </svg>
  );

  if (!showLink) return LogoContent;

  return (
    <Link href="/" className="flex items-center">
      {LogoContent}
    </Link>
  );
};

export default Logo;
