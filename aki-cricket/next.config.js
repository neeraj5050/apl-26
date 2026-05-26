/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  transpilePackages: ['three'],
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
