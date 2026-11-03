import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // <-- AGREGA ESTA LÍNEA
    remotePatterns: [],
  },
};

export default nextConfig;