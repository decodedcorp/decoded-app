import { cn } from '@/lib/utils/style';

interface ImagePlaceholderProps {
  className?: string;
  width?: number;
  height?: number;
}

export function ImagePlaceholder({
  className,
  width,
  height,
}: ImagePlaceholderProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 61 61"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_b_1931_6278)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M43.3321 0.476562H17.6152V6.90579H43.3321V0.476562ZM17.6372 6.92188L17.6152 6.93655V6.92188H11.1877V11.2065H6.92151V17.6341H6.92398L6.92188 17.6372V43.3227H6.92151V49.7502H11.1859L11.1979 49.7682H11.1877V54.0532H17.6128L17.6152 54.0548V60.4824H43.3321V54.0695H43.3541L43.3786 54.0532H49.7691V49.7929L49.7834 49.7834L49.8054 49.7502H54.0353V43.4055L54.0695 43.3541V43.3321H60.4802V17.6152H54.0548L54.0353 17.5859V11.2065H49.7811L49.7691 11.1985V6.92188H43.3541H43.3416H17.6372ZM11.2065 11.2102V11.2069H11.2097L11.208 11.208L11.2065 11.2102ZM0.476562 17.6152V43.3321H6.90579L6.90579 17.6152H0.476562ZM27.05 29.05V38.55H32.15V34H36.65V29.5H41.25V20H36.65V15.45H22.55V20H18V29.5H23.05V20.5H36.15V29.05H27.05ZM27.05 42.6V47.6H32.15V42.6H27.05Z"
          fill="#353535"
        />
      </g>
      <defs>
        <filter
          id="filter0_b_1931_6278"
          x="-14.5234"
          y="-14.5234"
          width="90.0039"
          height="90.0059"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="7.5" />
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect1_backgroundBlur_1931_6278"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_backgroundBlur_1931_6278"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}
