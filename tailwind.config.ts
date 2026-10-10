import type { Config } from "tailwindcss";

const config: Config = {
  // Archivos donde Tailwind buscará clases utilitarias
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta alineada con tu sitio principal
        base: "#0a0a0a",
        soft: "#111111",
        line: "#1f2937",
        accent: "#2563eb",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;