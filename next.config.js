/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["img.youtube.com"],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "https://brewlabs.info",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
