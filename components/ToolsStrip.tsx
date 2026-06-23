import Link from "next/link";
import CjIcon from "@/components/CjIcon";
import { TOOL_ICONS } from "@/lib/brand-assets";

export const TOOLS = [
  { href: "/studio", label: "Studio", desc: "Projects & PM board" },
  { href: "/project-match", label: "Project Match", desc: "Find collaborators" },
  { href: "/dashboard", label: "Dashboard", desc: "Your tracks & stats" },
  { href: "/collab", label: "Collab", desc: "Task boards" },
  { href: "/circles", label: "Circles", desc: "Private groups" },
  { href: "/listening-rooms", label: "Rooms", desc: "Listen together" },
  { href: "/blind-echo", label: "Blind Echo", desc: "7-min audio match" },
  { href: "/echo-roulette", label: "Echo Roulette", desc: "Spin & connect" },
] as const;

interface ToolsStripProps {
  variant?: "compact" | "full";
  title?: string;
}

export default function ToolsStrip({ variant = "full", title = "Your Tools" }: ToolsStripProps) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl uppercase text-cj-gold md:text-2xl">{title}</h2>
        <Link href="/studio" className="text-[10px] uppercase tracking-widest text-cj-gold-muted hover:text-cj-gold">
          Open Studio
        </Link>
      </div>
      <div
        className={
          variant === "compact"
            ? "flex gap-2 overflow-x-auto pb-2 scrollbar-thin"
            : "grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        }
      >
        {TOOLS.map(({ href, label, desc }) => (
          <Link
            key={href}
            href={href}
            className={
              variant === "compact"
                ? "flex shrink-0 items-center gap-2 rounded-lg border border-cj-gold-border bg-cj-purple-card px-4 py-3 no-underline transition-colors hover:border-cj-gold/60"
                : "group cj-card flex items-center gap-4 py-4 no-underline transition-all hover:border-cj-gold/60 hover:bg-cj-purple-card/90"
            }
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cj-gold-border bg-cj-dark group-hover:border-cj-gold/50">
              <CjIcon
                src={TOOL_ICONS[href]}
                alt=""
                size={22}
                className="opacity-80 group-hover:opacity-100"
              />
            </div>
            <div className={variant === "compact" ? "" : "min-w-0"}>
              <p className="text-sm font-semibold uppercase tracking-wide text-cj-gold">{label}</p>
              {variant === "full" && <p className="mt-0.5 text-xs text-cj-gold-muted">{desc}</p>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
