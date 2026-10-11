"use client";

// =============================================================
// Placeholder para anuncios (Adsterra / Monetag / etc.)
// =============================================================

import { useEffect, useRef, useState } from "react";

interface AdPlaceholderProps {
  /** Texto a mostrar mientras no hay anuncio real */
  label?: string;
  /** Clases extra para controlar tamaño, márgenes, etc. */
  className?: string;
  /** Código HTML del anuncio (opcional). */
  html?: string;
}

export default function AdPlaceholder({
  label = "Espacio publicitario",
  className = "",
  html,
}: AdPlaceholderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Solo renderizamos el anuncio cuando estamos en el cliente
  // Esto evita el error de hidratación de Next.js
  useEffect(() => {
    setMounted(true);

    if (!html || !containerRef.current) return;

    // Inyectamos el HTML del anuncio
    containerRef.current.innerHTML = html;

    // Extraemos y re-ejecutamos los <script> que vienen dentro del HTML
    // (innerHTML no ejecuta scripts automáticamente)
    const scripts = containerRef.current.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      // Copiamos todos los atributos
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      // Copiamos el contenido inline del script (si lo tiene)
      if (oldScript.innerHTML) {
        newScript.innerHTML = oldScript.innerHTML;
      }
      // Reemplazamos el script viejo por el nuevo (esto lo ejecuta)
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });
  }, [html]);

  // Si no hay HTML, mostramos el placeholder tradicional
  if (!html) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border border-dashed border-neutral-800 bg-neutral-900/40 text-neutral-500 text-xs text-center px-3 ${className}`}
        aria-hidden="true"
      >
        {label}
      </div>
    );
  }

  // Si hay HTML, pero aún no se ha montado en el cliente, mostramos espacio vacío
  // (evita el mismatch entre servidor y cliente)
  if (!mounted) {
    return (
      <div
        className={`flex items-center justify-center overflow-hidden ${className}`}
        aria-hidden="true"
      />
    );
  }

  // Una vez montado en cliente, inyectamos los anuncios
  return (
    <div
      ref={containerRef}
      className={`flex items-center justify-center overflow-hidden ${className}`}
    />
  );
}