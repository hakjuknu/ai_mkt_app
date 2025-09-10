import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 이미지 최적화 설정
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // 압축 설정
  compress: true,

  // 번들 분석기 설정
  webpack: async (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // 프로덕션 빌드에서만 번들 분석기 활성화
    if (!dev && !isServer && process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = await import('webpack-bundle-analyzer') as any;
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: './bundle-analysis.html',
        })
      );
    }
    return config;
  },

  // 실험적 기능
  experimental: {
    optimizeCss: false, // critters 문제 해결을 위해 비활성화
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },

  // 헤더 설정
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ];
  },

  // 리다이렉트 설정
  async redirects() {
    return [
      {
        source: '/test-page',
        destination: '/test',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;