import { SVGProps } from "react"

interface PointIconProps extends SVGProps<SVGSVGElement> {
  className?: string
}

export function PointIcon({ className, ...props }: PointIconProps) {
  return (
    <svg
      width="61"
      height="61"
      viewBox="0 0 61 61"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <g filter="url(#filter0_b_1885_8928)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M43.3321 0.476562H17.6152V6.90579H43.3321V0.476562ZM17.6372 6.92188L17.6152 6.93655V6.92188H11.1877V11.2065H6.92151V17.6341H6.92398L6.92188 17.6372V43.3227H6.92151V49.7502H11.1859L11.1979 49.7682H11.1877V54.0532H17.6128L17.6152 54.0548V60.4824H43.3321V54.0695H43.3541L43.3786 54.0532H49.7691V49.7929L49.7834 49.7834L49.8054 49.7502H54.0353V43.4055L54.0695 43.3541V43.3321H60.4802V17.6152H54.0548L54.0353 17.5859V11.2065H49.7811L49.7691 11.1985V6.92188H43.3541H43.3416H17.6372ZM11.2065 11.2102V11.2069H11.2097L11.208 11.208L11.2065 11.2102ZM0.476562 17.6152V43.3321H6.90579L6.90579 17.6152H0.476562ZM20.5044 16.4761V44.4716H27.3604V33.6162H41.0726V30.1882H44.5006V19.9041H41.0726V16.4761H20.5044ZM37.6445 30.1882H27.3604V19.9041H37.6445V30.1882Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <filter
          id="filter0_b_1885_8928"
          x="-14.5234"
          y="-14.5234"
          width="90.0039"
          height="90.0078"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="7.5" />
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect1_backgroundBlur_1885_8928"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_backgroundBlur_1885_8928"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  )
} 