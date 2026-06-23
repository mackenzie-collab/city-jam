import CjIcon from "@/components/CjIcon";
import { ICONS } from "@/lib/brand-assets";
import { cn } from "@/lib/utils";

interface StreakIconProps {
  size?: number;
  className?: string;
}

/** City Jam thunder mark for Jam Streak UI */
export default function StreakIcon({ size = 20, className }: StreakIconProps) {
  return (
    <CjIcon
      src={ICONS.lightning}
      alt=""
      size={size}
      className={cn("shrink-0 opacity-90", className)}
    />
  );
}
