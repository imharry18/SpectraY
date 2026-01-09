/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1:5000/api/:path*' // Proxy to Flask in dev
            : '/api/', // In production, Vercel handles this
      },
    ];
  },
};

export default nextConfig;