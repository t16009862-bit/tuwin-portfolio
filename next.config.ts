import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/colombo-junior-squash-championship-2026-appreciation.pdf',
        headers: [
          {
            key: 'Content-Disposition',
            value: 'attachment; filename="Sri-Lanka-Squash-Appreciation-Letter-Tuwin-Herath.pdf"',
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;
