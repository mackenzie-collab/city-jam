type ErrorContext = {
  boundary?: string;
  route?: string;
  extra?: Record<string, unknown>;
};

function formatMessage(context?: string | ErrorContext): string {
  if (!context) return "[City Jam]";
  if (typeof context === "string") return `[City Jam] ${context}`;

  const parts = ["[City Jam]"];
  if (context.boundary) parts.push(context.boundary);
  if (context.route) parts.push(context.route);
  return parts.join(" ");
}

/** Client error boundary — dev console only; hook Sentry here when added. */
export function reportClientError(error: unknown, context?: string | ErrorContext): void {
  if (process.env.NODE_ENV !== "production") {
    console.error(formatMessage(context), error);
  }
}

/** Server/API failures — always log for Vercel runtime logs. */
export function reportServerError(error: unknown, context?: string | ErrorContext): void {
  console.error(formatMessage(context), error);
}
