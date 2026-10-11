"use client";

// =============================================================
// Placeholder para anuncios (Adsterra / Monetag / etc.)
// Usa un iframe que se autoajusta al tamaño real del anuncio
// =============================================================

import { useEffect, useRef } from "react";

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

  useEffect(() => {
    if (!html || !containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = "";

    // Creamos el iframe
    const iframe = document.createElement("iframe");
    iframe.style.width = "100%";
    iframe.style.border = "0";
    iframe.style.display = "block";
    iframe.style.backgroundColor = "transparent";
    iframe.setAttribute("scrolling", "no");
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("allowtransparency", "true");

    // Altura inicial mínima
    iframe.style.height = "0px";

    container.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document;
    if (!iframeDoc) return;

    // Escribimos el HTML del anuncio dentro del iframe
    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            html, body {
              margin: 0;
              padding: 0;
              background-color: #0a0a0a !important;
              color: #ededed;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              min-height: 100%;
              overflow: hidden;
              font-family: system-ui, sans-serif;
            }
            /* Forzamos fondo oscuro en elementos internos del anuncio */
            body > * {
              background-color: transparent !important;
            }
            table, tr, td, div, span, a, p {
              background-color: transparent !important;
            }
            iframe {
              background-color: #0a0a0a !important;
              border: 0 !important;
            }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `);
    iframeDoc.close();

    // 🔑 Función para ajustar la altura del iframe al contenido real
    const adjustHeight = () => {
      if (!iframeDoc.body) return;
      const height = iframeDoc.body.scrollHeight;
      // Altura mínima según el contenido
      const minHeight = 90;
      iframe.style.height = `${Math.max(height, minHeight)}px`;
    };

    // Ajustamos después de que cargue
    iframe.onload = adjustHeight;

    // Observamos cambios en el tamaño del contenido del iframe
    if (iframeDoc.body) {
      const resizeObserver = new ResizeObserver(adjustHeight);
      resizeObserver.observe(iframeDoc.body);

      // Limpiamos el observer cuando se desmonte
      return () => resizeObserver.disconnect();
    }

    // Ajuste inicial y reintentos
    setTimeout(adjustHeight, 100);
    setTimeout(adjustHeight, 500);
    setTimeout(adjustHeight, 1500);
    setTimeout(adjustHeight, 3000);
  }, [html]);

  // Si no hay anuncio, mostramos el placeholder
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

  return (
    <div
      ref={containerRef}
      className={`flex items-center justify-center overflow-hidden ${className}`}
    />
  );
}