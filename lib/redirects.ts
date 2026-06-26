export const DEFAULT_RETURN_PATH = "/";

export function safeReturnPath(
  value: string | null | undefined,
  fallback = DEFAULT_RETURN_PATH
): string {
  const path = value?.trim();
  if (!path) return fallback;
  if (!path.startsWith("/") || path.startsWith("//") || path.startsWith("/\\")) {
    return fallback;
  }
  if (/[\u0000-\u001f\u007f]/.test(path)) return fallback;
  return path;
}
