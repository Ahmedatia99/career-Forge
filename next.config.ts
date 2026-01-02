import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   typescript: {
      ignoreBuildErrors: true,
    },
    images: {
      unoptimized: true,
    },
     serverExternalPackages: [
    '@sparticuz/chromium-min',
    'puppeteer-core',
    'puppeteer'
  ],
  
  turbopack: {}
};

export default nextConfig;
