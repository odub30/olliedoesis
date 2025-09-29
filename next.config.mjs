/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // This sets the Node.js memory limit for builds
  experimental: {
    // Add any experimental features here if needed
  },
  // Configure webpack to increase memory
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.optimization.minimizer = [];
    }
    return config;
  },
};

export default nextConfig;