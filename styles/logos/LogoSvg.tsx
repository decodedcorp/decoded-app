interface LogoSvgProps {
  fontSize?: number;
}

export default function LogoSvg({ fontSize = 28 }: LogoSvgProps) {
  const textWidth = fontSize * 6;
  const textHeight = fontSize * 1.2;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={textWidth}
      height={textHeight}
      viewBox={`0 0 ${textWidth} ${textHeight}`}
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
        x="40%"
        y="62%"
        fill="#EAFD66"
        filter="url(#glow)"
        style={{
          fontFamily: "Syncopate, sans-serif",
          fontSize: `${fontSize}px`,
          fontWeight: "bold",
        }}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        DEC
        <tspan fill="#EAFD66" opacity="0.8">
          O
        </tspan>
        DED
      </text>

      <text
        x="40%"
        y="62%"
        fill="none"
        stroke="#EAFD66"
        strokeWidth="0.5"
        opacity="0.3"
        style={{
          fontFamily: "Orbitron, sans-serif",
          fontSize: `${fontSize * 1.1}px`,
          fontWeight: "bold",
        }}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        DECODED
      </text>
    </svg>
  );
}
