/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tối ưu cho Cloudflare Pages
  // Không cần chỉ định output và distDir khi dùng Cloudflare Pages

  // Cấu hình Image Optimization
  images: {
    domains: ['img.ophim.live', 'ophim1.com', 'via.placeholder.com'],
    formats: ['image/webp'],
    minimumCacheTTL: 60 * 60 * 24, // 24 hours
    unoptimized: true, // Tắt tối ưu hóa hình ảnh để tương thích với Cloudflare Pages
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.ophim.live',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.ophim1.com',
        pathname: '/**',
      },
    ],
  },

  // Tối ưu hóa
  reactStrictMode: true,
  poweredByHeader: false,

  // Tối ưu hiệu suất
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Tối ưu tải trang
  experimental: {
    // optimizeCss: true, // Bỏ tùy chọn này vì nó yêu cầu critters
    optimizePackageImports: ['react-icons'],
  },
};

export default nextConfig;
