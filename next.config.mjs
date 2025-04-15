/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tắt ESLint trong quá trình build
  eslint: {
    // Cảnh báo thay vì lỗi trong quá trình build
    ignoreDuringBuilds: true,
  },

  // Tắt TypeScript trong quá trình build
  typescript: {
    // Cảnh báo thay vì lỗi trong quá trình build
    ignoreBuildErrors: true,
  },

  // Sử dụng output: 'export' để tạo các file tính
  output: 'export',
  distDir: 'out',

  // Tắt tạo image tự động
  images: {
    unoptimized: true,
  },

  // Tối ưu hóa webpack
  webpack: (config, { isServer }) => {
    // Tối ưu hóa các module
    config.optimization.minimize = true;

    // Chia nhỏ các chunk
    config.optimization.splitChunks = {
      chunks: 'all',
      maxInitialRequests: 25,
      minSize: 5000,
      maxSize: 20 * 1024 * 1024, // 20MB
      cacheGroups: {
        default: false,
        vendors: false,
        framework: {
          name: 'framework',
          test: /[\\/]node_modules[\\/](@next\/react|react|react-dom|scheduler)[\\/]/,
          priority: 40,
          enforce: true,
        },
        lib: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            if (!module.context) return 'npm.unknown';
            const match = module.context.match(/[\\/]node_modules[\\/](.+?)(?:[\\/]|$)/);
            const packageName = match ? match[1] : 'unknown';
            return `npm.${packageName.replace('@', '')}`;
          },
          priority: 30,
          minSize: 5000,
          maxSize: 20 * 1024 * 1024, // 20MB
        },
        commons: {
          name: 'commons',
          minChunks: 2,
          priority: 20,
        },
        shared: {
          name: 'shared',
          minChunks: 2,
          priority: 10,
          reuseExistingChunk: true,
          enforce: true,
        },
      },
    };

    // Bỏ qua thư mục cache
    config.watchOptions = {
      ignored: ['**/.git/**', '**/node_modules/**', '**/.next/cache/**', '**/cache/**'],
    };

    return config;
  },
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
    // optimizePackageImports: ['react-icons'], // Bỏ tùy chọn này vì không dùng react-icons
  },
};

export default nextConfig;
