/** @type {import('next').NextConfig} */

const DEFAULT_SUPABASE_HOST = "ifrhsazcivovyiusxpkx.supabase.co";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  process.env.NEXT_PUBLIC_APP_URL?.trim() ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

function getSupabaseImageHost() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!supabaseUrl) return DEFAULT_SUPABASE_HOST;

  try {
    return new URL(supabaseUrl).hostname;
  } catch {
    return DEFAULT_SUPABASE_HOST;
  }
}

const nextConfig = {
  env: siteUrl ? { NEXT_PUBLIC_SITE_URL: siteUrl.replace(/\/$/, "") } : {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: getSupabaseImageHost(),
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/affiliate",
        destination: "/#affiliates",
        permanent: false,
      },
    ];
  },
};
export default nextConfig;

