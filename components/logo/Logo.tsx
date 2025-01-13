import Link from "next/link";
import { cn } from "@/lib/utils/style/index";

function Logo({ isScrolled }: { isScrolled: boolean }) {
  return (
    <div
      className={cn(
        "animate-fade-in transition-all duration-default ease-default flex items-center",
        isScrolled ? "justify-start" : "justify-center"
      )}
    >
      <Link href="/" prefetch={false} className="inline-block">
        <svg
          width={isScrolled ? 150 : 250}
          height={isScrolled ? 40 : 60}
          viewBox="0 0 400 120"
          xmlns="http://www.w3.org/2000/svg"
          className="hover:opacity-80 transition-opacity md:w-[200px] md:h-[48px]"
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
              fontFamily: "Syncopate, sans-serif",
              fontSize: "52px",
              fontWeight: "bold",
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
              fontFamily: "Orbitron, sans-serif",
              fontSize: "56px",
              fontWeight: "bold",
            }}
          >
            DECODED
          </text>
        </svg>
      </Link>
    </div>
  );
}

export default Logo;
