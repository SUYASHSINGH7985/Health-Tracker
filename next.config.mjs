/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Enable strict mode for better development experience
  reactStrictMode: true,
  // Configure server settings
  experimental: {
    serverActions: true,
  },
  poweredByHeader: false,
}

export default nextConfig
