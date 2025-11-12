// Next.js Configuration для Go2Asia PWA Shell
// Разместить в: apps/go2asia-pwa-shell/next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router (по умолчанию в Next.js 15)
  reactStrictMode: true,
  
  // PWA настройки
  swcMinify: true,
  
  // Переменные окружения
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.go2asia.space',
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  },
  
  // Изображения
  images: {
    domains: ['cdn.go2asia.space', 'images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Headers для безопасности
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  
  // Experimental features
  experimental: {
    // Для оптимизации производительности
    optimizePackageImports: ['@go2asia/ui', '@go2asia/sdk'],
  },
};

module.exports = nextConfig;

