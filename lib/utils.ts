// =============================================================
// Utilidades generales del proyecto
// =============================================================

// URL del sitio principal (para redirigir si algo falla)
export const MAIN_SITE_URL = "https://rikitech-hd.vercel.app";

// Clave usada en localStorage para recordar visitas previas
export const VISITED_KEY = "rk_download_visited";

// Dominios permitidos como destino de descarga.
// Se comparan por hostname exacto o subdominio (ej: "www.mediafire.com").
export const ALLOWED_DOMAINS: string[] = [
  "mediafire.com",
  "mega.nz",
  "mega.io",
  "drive.google.com",
  "docs.google.com",
  "dropbox.com",
  "1drv.ms",
  "onedrive.live.com",
  "pixeldrain.com",
  "gofile.io",
  "workupload.com",
  "uploadhaven.com",
  "anonfiles.com",
  "solidfiles.com",
];

/**
 * Valida que la URL recibida sea:
 *  - una URL válida
 *  - con protocolo http/https
 *  - perteneciente a un dominio permitido
 */
export function isValidDownloadUrl(raw: string | null | undefined): boolean {
  if (!raw) return false;
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;

    const host = url.hostname.toLowerCase();
    return ALLOWED_DOMAINS.some(
      (domain) => host === domain || host.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

/**
 * Devuelve el dominio legible de una URL (sin "www.")
 * Se usa para mostrar "Destino: mediafire.com" en la tarjeta.
 */
export function getDomain(raw: string | null | undefined): string {
  if (!raw) return "";
  try {
    return new URL(raw).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/**
 * Formatea un número con separador de miles (ej: 12483 -> "12,483")
 * Usado por el contador de descargas.
 */
export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}