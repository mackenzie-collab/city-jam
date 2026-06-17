import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CjIcon from "@/components/CjIcon";
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
    title: "Signal Map",
    href: "/signal-map",
    description: "See musicians online globally. Neighborhood-level only.",
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
    <section className="bg-cj-purple-dark px-6 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <span className="cj-badge mb-6">Explore</span>
        <h2 className="cj-heading-display text-5xl md:text-7xl">
          More Tools.
          <br />
          <span className="text-cj-gold-bright">Your Scene.</span>
        </h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.title}
              href={tool.href}
              className="group cj-card block transition-all hover:border-cj-gold/60 hover:bg-cj-purple-card/80"
            >
              <CjIcon
                src={TOOL_ICONS[tool.href]}
                alt=""
                size={28}
                className="mb-4 opacity-80 group-hover:opacity-100"
              />
              <h3 className="font-display text-2xl uppercase text-cj-gold">
                {tool.title}
              </h3>
              <p className="mt-3 text-sm text-cj-gold-muted">
                {tool.description}
              </p>
              <span className="mt-6 inline-flex items-center gap-1 text-xs uppercase tracking-widest text-cj-gold group-hover:gap-2 transition-all">
                Open <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
