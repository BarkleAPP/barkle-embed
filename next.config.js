/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['misskey-js'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/note/:slug*',
        destination: '/barks/:slug*',
        permanent: true,
      },
    ]
  }
}

module.exports = nextConfig
