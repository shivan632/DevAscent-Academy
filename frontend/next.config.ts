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
    return [
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

