import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ESTA ES LA LÍNEA MÁGICA PARA CLOUDFLARE PAGES
  output: 'export',
  
  // Evita que Next intente optimizar imágenes externas por ahora.
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;