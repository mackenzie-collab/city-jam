import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CjIcon from "@/components/CjIcon";
import VinylCard from "@/components/analog/VinylCard";
import GrainOverlay from "@/components/GrainOverlay";
import BarcodeDivider from "@/components/BarcodeDivider";
import { TOOL_ICONS } from "@/lib/brand-assets";

const tools = [
  {
    title: "Community Hub",
    href: "/community",
    description: "Feed, streaks, project board — the heart of the scene.",
  },
  {
    title: "Studio Hub",
    href: "/studio",
    description: "Your command center — projects, stats, and connected tools.",
  },
  {
    title: "Project Match",
    href: "/project-match",
    description: "Post what your track needs. Get matched by intent.",
  },
  {
    title: "Circles",
    href: "/circles",
    description: "Invite-only groups around a sound, city or shared goal.",
  },
  {
    title: "Vault",
    href: "/vault",
    description: "Private storage for recordings, demos, stems.",
  },
  {
    title: "Collab",
    href: "/collab",
    description: "Project boards with files, tasks, chord sheets.",
  },
  {
    title: "Listen Rooms",
    href: "/listening-rooms",
    description: "Shared rooms with timestamped commentary.",
  },
];

export default function MoreToolsGrid() {
  return (
    <section className="cj-section cj-section-poster relative overflow-hidden bg-brand-purple-deep">
      <GrainOverlay intensity={0.035} />
      <div className="relative mx-auto max-w-6xl">
        <BarcodeDivider className="mb-6 max-w-sm opacity-65" />
        <span className="cj-badge mb-4 sm:mb-6">Explore</span>
        <h2 className="cj-poster-headline text-3xl sm:text-4xl md:text-5xl">
          More tools.{" "}
          <span className="text-brand-gold">Your scene.</span>
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {tools.map((tool, i) => (
            <Link key={tool.title} href={tool.href} className="group block no-underline">
              <VinylCard className="h-full border-[var(--cj-zine-border)] bg-brand-purple transition-shadow hover:border-brand-gold/40 hover:shadow-lg">
                <div className="mb-3 flex items-center justify-between">
                  <CjIcon
                    src={TOOL_ICONS[tool.href]}
                    alt=""
                    size={24}
                    className="opacity-80 group-hover:opacity-100"
                  />
                  <span className="font-mono text-xs tabular-nums text-cj-text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-display text-lg uppercase tracking-[0.06em] text-cj-text sm:text-xl">
                  {tool.title}
                </h3>
                <p className="mt-2 font-mono text-sm text-cj-text-muted">{tool.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wide text-brand-gold transition-all group-hover:gap-2">
                  Open <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </VinylCard>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
