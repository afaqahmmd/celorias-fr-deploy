import Image from "next/image";
import { siteAssets } from "@/config/assets";

interface CeloriaLogoProps {
  className?: string;
  height?: number;
  width?: number;
}

export default function CeloriaLogo({
  className = "",
  height = 78,
  width = 200,
}: CeloriaLogoProps) {
  return (
    <Image
      src={siteAssets.logo}
      alt="Celoria"
      width={width}
      height={height}
      className={`max-w-full object-contain object-left ${className}`}
      style={{ height, width: "auto", maxWidth: width }}
      priority
    />
  );
}
