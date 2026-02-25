/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.jademaguirephotography.uk',
      },
    ],
  },
};

export default nextConfig;
