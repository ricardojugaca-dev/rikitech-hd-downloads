import Link from "next/link";

// =============================================================
// Sección "Posts interesantes" (marcador de posición)
// Cambia los títulos y las URLs por artículos reales de tu sitio.
// =============================================================

const POSTS = [
  {
    title: "Cómo descargar e instalar Windows 11 paso a paso",
    href: "https://rikitechhd.vercel.app",
  },
  {
    title: "Los 10 mejores programas gratis para tu PC en 2025",
    href: "https://rikitechhd.vercel.app",
  },
  {
    title: "Guía completa: instalar Office sin errores",
    href: "https://rikitechhd.vercel.app",
  },
  {
    title: "Cómo acelerar tu PC sin formatear (trucos reales)",
    href: "https://rikitechhd.vercel.app",
  },
];

export default function InterestingPosts() {
  return (
    <section className="w-full max-w-4xl mx-auto px-4 pb-10">
      <h2 className="text-sm uppercase tracking-widest text-neutral-500 mb-4">
        Posts interesantes
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {POSTS.map((post, i) => (
          <Link
            key={i}
            href={post.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-3 rounded-xl border border-neutral-800 bg-neutral-950/60 hover:border-blue-600/60 hover:bg-neutral-900/60 transition-colors p-4"
          >
            {/* Número del post */}
            <span className="shrink-0 w-7 h-7 rounded-lg bg-blue-600/10 text-blue-500 text-xs font-bold flex items-center justify-center">
              {i + 1}
            </span>

            <span className="text-sm text-neutral-300 group-hover:text-white transition-colors leading-snug">
              {post.title}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}