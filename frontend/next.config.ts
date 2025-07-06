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
        hostname: 'localhost',
        port: '8000',
        pathname: '/api/images/**',
      },
      {
        protocol: 'https',
        hostname: 'api.myapp.com',
        pathname: '/api/images/**',
      }
    ],
  },
    transpilePackages: ['@mui/material', '@mui/system', '@mui/icons-material'],
};

export default withNextIntl(config);
