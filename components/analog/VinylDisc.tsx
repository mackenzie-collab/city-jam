import InteractiveVinyl from "@/components/vinyl/InteractiveVinyl";

interface VinylDiscProps {
  size?: number;
  spinning?: boolean;
  className?: string;
}

/** Decorative vinyl disc — use InteractiveVinyl directly for playable discs. */
export default function VinylDisc({ size = 56, spinning = false, className }: VinylDiscProps) {
  return (
    <InteractiveVinyl
      size={size}
      interactive={false}
      isPlaying={spinning}
      className={className}
    />
  );
}
