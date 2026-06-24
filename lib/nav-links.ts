/** Primary header / mobile drawer navigation */
export const PRIMARY_NAV_LINKS: { href: string; label: string; hash?: boolean }[] = [
  { href: "/", label: "Home" },
  { href: "/#affiliates", label: "Affiliates", hash: true },
  { href: "/discover", label: "Discover" },
  { href: "/scene", label: "Scene" },
  { href: "/studio", label: "Studio" },
  { href: "/jam", label: "Jam" },
  { href: "/profile", label: "Profile" },
];

/** Secondary tools in mobile drawer */
export const MOBILE_TOOL_LINKS = [
  { href: "/studio", label: "Studio Hub" },
  { href: "/project-match", label: "Project Match" },
  { href: "/collab", label: "Collab" },
  { href: "/circles", label: "Circles" },
  { href: "/listening-rooms", label: "Listening Rooms" },
] as const;
