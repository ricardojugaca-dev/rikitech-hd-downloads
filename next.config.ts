import type { NextConfig } from "next";

// Configuración mínima de Next.js.
// Si más adelante necesitas cabeceras de seguridad, rewrites, etc., se añaden aquí.
const nextConfig: NextConfig = {
  // Evita que Next intente optimizar imágenes externas por ahora.
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;