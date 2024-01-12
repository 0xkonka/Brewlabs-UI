/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/pools",
        destination: "/staking",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
