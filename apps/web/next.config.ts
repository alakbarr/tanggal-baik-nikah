import type { NextConfig } from 'next';
import withSerwistInit from '@serwist/next';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH;

const withSerwist = withSerwistInit({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
  ...(basePath ? { basePath } : {}),
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    '192.168.1.5',
    '192.168.1.*',
    '192.168.*',
    '10.0.*',
    '127.0.0.1',
    'localhost',
  ],
};

export default withSerwist(nextConfig);
