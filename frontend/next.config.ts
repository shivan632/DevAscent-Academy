import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize heavy barrel libraries so Turbopack/Webpack skips parsing 1,000s of unused modules
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'highlight.js',
      'rehype-highlight',
      'react-markdown',
      'canvas-confetti',
      'bootstrap-icons',
      'clsx',
      'tailwind-merge',
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async rewrites() {
    const atsBackend = (process.env.NEXT_PUBLIC_ATS_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
    return [
      {
        source: '/api/ats/:path*',
        destination: `${atsBackend}/:path*`,
      },
      {
        source: '/@:username',
        destination: '/u/:username',
      },
      {
        source: '/portfolio/:username',
        destination: '/u/:username',
      },
    ];
  },
};

export default nextConfig;

