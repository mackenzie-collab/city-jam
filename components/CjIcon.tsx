import Image from "next/image";
import { cn } from "@/lib/utils";

interface CjIconProps {
  src: string;
  alt?: string;
  size?: number;
  className?: string;
}

export default function CjIcon({ src, alt = "", size = 20, className }: CjIconProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn("object-contain", className)}
    />
  );
}
