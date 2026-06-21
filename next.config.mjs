/** @type {import('next').NextConfig} */

const siteUrl =

  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||

  process.env.NEXT_PUBLIC_APP_URL?.trim() ||

  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);



const nextConfig = {

  env: siteUrl ? { NEXT_PUBLIC_SITE_URL: siteUrl.replace(/\/$/, "") } : {},

};



export default nextConfig;

