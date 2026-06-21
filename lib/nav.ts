/**
 * Exact nav active matching — home is only active on `/`, nested routes match prefix.
 */
export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
