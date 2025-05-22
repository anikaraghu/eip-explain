/** @type {import('next').NextConfig} */
const nextConfig = {
  // Silence warnings
  // https://github.com/WalletConnect/walletconnect-monorepo/issues/1908
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  // Handle .well-known directory
  async rewrites() {
    return [
      {
        source: '/.well-known/farcaster/frame.json',
        destination: '/api/frame/metadata'
      }
    ];
  }
};

export default nextConfig;
