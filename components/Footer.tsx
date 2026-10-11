// =============================================================
// Pie de página con iconos de redes sociales
// =============================================================

import Link from "next/link";

const SOCIALS = [
  {
    name: "Facebook",
    href: "https://facebook.com/rikitech",
    hoverColor: "hover:border-[#1877F2] hover:bg-[#1877F2]/10 hover:text-[#1877F2]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M22 12.07C22 6.5 17.52 2 12 2S2 6.5 2 12.07C2 17.1 5.66 21.25 10.44 22v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.5-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.9h2.78l-.44 2.9h-2.34V22C18.34 21.25 22 17.1 22 12.07z" />
      </svg>
    ),
  },
  {
    name: "X",
    href: "https://x.com/rikitechhd",
    hoverColor: "hover:border-white hover:bg-white/10 hover:text-white",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@rikitechhd",
    hoverColor: "hover:border-[#FF0000] hover:bg-[#FF0000]/10 hover:text-[#FF0000]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z" />
      </svg>
    ),
  },
  {
    name: "Telegram",
    href: "https://t.me/rikitechhd",
    hoverColor: "hover:border-[#24A1DE] hover:bg-[#24A1DE]/10 hover:text-[#24A1DE]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-1.97 9.29c-.15.66-.54.82-1.09.51l-3.02-2.23-1.46 1.41c-.16.16-.3.3-.61.3l.22-3.08 5.61-5.07c.24-.22-.05-.34-.38-.13l-6.93 4.36-2.98-.93c-.65-.2-.66-.65.14-.96l11.66-4.49c.54-.2 1.01.13.82 1.02z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-neutral-800 bg-neutral-900/40 backdrop-blur-md mt-6">
      <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Copyright */}
        <p className="text-xs text-neutral-500 text-center sm:text-left">
          © {year}{" "}
          <a
            href="https://rikitech-hd.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-300 font-semibold hover:text-blue-400 transition-colors"
            title="Ir a RikiTechHD"
            aria-label="Ir a RikiTechHD"
          >
            RikiTechHD
          </a>
          . Todos los derechos reservados.
        </p>

        {/* Redes sociales */}
        <div className="flex items-center gap-2">
          {SOCIALS.map((s) => (
            <Link
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.name}
              title={s.name}
              className={`w-9 h-9 rounded-lg border border-neutral-800 text-neutral-400 transition-all duration-200 hover:scale-110 flex items-center justify-center ${s.hoverColor}`}
            >
              {s.icon}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}