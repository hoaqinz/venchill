import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tối ưu cho Cloudflare Pages
  output: 'standalone',

  // Cấu hình Image Optimization
  images: {
    domains: ['img.ophim.live', 'ophim1.com'],
    formats: ['image/webp'],
    minimumCacheTTL: 60 * 60 * 24, // 24 hours
  },

  // Cấu hình cache
  experimental: {
    serverActions: {
      allowedOrigins: ['*'],
    },
  },

  // Tối ưu hóa
  swcMinify: true,
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
