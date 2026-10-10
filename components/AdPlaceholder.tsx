// =============================================================
// Marcador de posición para anuncios (Adsterra / Monetag / etc.)
// Reemplaza el contenido con el <script> o <iframe> del anuncio real.
// =============================================================

interface AdPlaceholderProps {
  /** Texto a mostrar dentro del recuadro */
  label?: string;
  /** Clases extra para controlar tamaño, márgenes, etc. */
  className?: string;
}

export default function AdPlaceholder({
  label = "Espacio publicitario",
  className = "",
}: AdPlaceholderProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-lg border border-dashed border-neutral-800 bg-neutral-900/40 text-neutral-500 text-xs text-center px-3 ${className}`}
      aria-hidden="true"
    >
      {label}
    </div>
  );
}