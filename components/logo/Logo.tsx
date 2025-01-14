import Link from "next/link";
import LogoSvg from "@/styles/logos/LogoSvg";

function Logo() {
  return (
    <div className="flex">
      <Link href="/" prefetch={false}>
        <LogoSvg />
      </Link>
    </div>
  );
}

export default Logo;
