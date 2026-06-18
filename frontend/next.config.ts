import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const config: NextConfig = {
    reactStrictMode: true,
    experimental: {
        serverActions: {},
    },
images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'api.dev.local',
        port: '',
        pathname: '/api/images/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/api/images/**',
      },
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_API_URL?.replace('http://', 'https://').split('/')[2] || 'api.dev.local', // Extract hostname from API URL
        pathname: '/api/images/**',
      }
    ],
  },
    transpilePackages: ['@mui/material', '@mui/system', '@mui/icons-material'],
};

export default withNextIntl(config);
