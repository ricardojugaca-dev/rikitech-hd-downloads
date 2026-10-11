"use client";

// =============================================================
// Placeholder para anuncios (Adsterra / Monetag / etc.)
// Acepta código HTML inyectado directamente
// =============================================================

interface AdPlaceholderProps {
  /** Texto a mostrar mientras no hay anuncio real */
  label?: string;
  /** Clases extra para controlar tamaño, márgenes, etc. */
  className?: string;
  /** Código HTML del anuncio (opcional). Si está presente, se muestra. */
  html?: string;
}

export default function AdPlaceholder({
  label = "Espacio publicitario",
  className = "",
  html,
}: AdPlaceholderProps) {
  // Si hay código HTML del anuncio, lo inyectamos
  if (html) {
    return (
      <div
        className={`flex items-center justify-center overflow-hidden ${className}`}
        // ⚠️ dangerouslySetInnerHTML es necesario para inyectar el script de Adsterra
        // suppressHydrationWarning evita el warning de React cuando Adsterra
        // modifica el DOM después de la carga (los scripts se ejecutan en el cliente)
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  // Si no hay anuncio, mostramos el placeholder
  return (
    <div
      className={`flex items-center justify-center rounded-lg border border-dashed border-neutral-800 bg-neutral-900/40 text-neutral-500 text-xs text-center px-3 ${className}`}
      aria-hidden="true"
    >
      {label}
    </div>
  );
}