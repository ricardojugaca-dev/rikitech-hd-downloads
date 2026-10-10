"use client";

// =============================================================
// Página principal de la puerta de descarga
// Flujo:
//   1. Lee ?url= de la query string
//   2. Valida que sea un dominio permitido
//   3. Muestra cuenta regresiva de 10s (o 3s si ya visitó antes)
//   4. Al terminar, muestra el botón "Continuar a la descarga"
// =============================================================

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import CountdownCircle from "@/components/CountdownCircle";
import AdPlaceholder from "@/components/AdPlaceholder";
import InterestingPosts from "@/components/InterestingPosts";
import Footer from "@/components/Footer";
import {
  MAIN_SITE_URL,
  VISITED_KEY,
  formatNumber,
  getDomain,
  isValidDownloadUrl,
} from "@/lib/utils";

// Duración normal y duración reducida si el usuario ya pasó por aquí
const FULL_DURATION = 10;
const SHORT_DURATION = 3;

// Contador de descargas (marcador de posición hasta que tengas uno real)
const FAKE_TODAY_DOWNLOADS = 12483;

// -------------------------------------------------------------
// Componente interno (usa useSearchParams → necesita Suspense)
// -------------------------------------------------------------
function DownloadGate() {
  const searchParams = useSearchParams();
  const rawUrl = searchParams.get("url");

  // Estados
  const [ready, setReady] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [total, setTotal] = useState(FULL_DURATION);
  const [remaining, setRemaining] = useState(FULL_DURATION);
  const [done, setDone] = useState(false);

  // --- 1. Validación inicial + duración dinámica ---
  useEffect(() => {
    // Si la URL no es válida o no está permitida → redirigimos al sitio principal
    if (!isValidDownloadUrl(rawUrl)) {
      setInvalid(true);
      const t = setTimeout(() => {
        window.location.replace(MAIN_SITE_URL);
      }, 2000);
      return () => clearTimeout(t);
    }

    // Si el usuario ya pasó por aquí antes, reducimos la espera
    let duration = FULL_DURATION;
    try {
      if (localStorage.getItem(VISITED_KEY) === "1") {
        duration = SHORT_DURATION;
      }
    } catch {
      // localStorage puede fallar en modo incógnito estricto; lo ignoramos
    }

    setTotal(duration);
    setRemaining(duration);
    setReady(true);
  }, [rawUrl]);

  // --- 2. Lógica de la cuenta regresiva ---
  useEffect(() => {
    if (!ready || invalid || done) return;

    if (remaining <= 0) {
      setDone(true);
      // Marcamos al usuario como "ya visitó" para futuras visitas
      try {
        localStorage.setItem(VISITED_KEY, "1");
      } catch {}
      return;
    }

    const timer = setTimeout(() => {
      setRemaining((r) => r - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [ready, invalid, done, remaining]);

  // --- 3. Acción del botón "Continuar" ---
  const handleContinue = useCallback(() => {
    if (!rawUrl) return;
    window.location.href = rawUrl;
  }, [rawUrl]);

  // --- 4. Render: URL inválida ---
  if (invalid) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center text-2xl">
            !
          </div>
          <h1 className="text-lg font-semibold text-white mb-2">
            Enlace no válido
          </h1>
          <p className="text-sm text-neutral-400">
            La URL proporcionada no es segura o no está permitida.
            Redirigiendo a RikiTechHD...
          </p>
        </div>
      </main>
    );
  }

  // --- 5. Render principal ---
  return (
    <main className="min-h-screen flex flex-col">
      {/* ======================= TARJETA CENTRAL ======================= */}
      <section className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl rounded-2xl border border-neutral-800 bg-neutral-950/70 backdrop-blur-sm p-6 sm:p-10 shadow-2xl shadow-black/40">
          {/* Logo de marcador de posición (reemplázalo con <Image /> de tu logo) */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-600/30">
              R
            </div>
          </div>

          {/* Título y subtítulo */}
          <h1 className="text-center text-2xl sm:text-3xl font-semibold text-white mb-2">
            {done ? "¡Enlace listo!" : "Preparando tu descarga"}
          </h1>
          <p className="text-center text-sm text-neutral-400 mb-8">
            {done
              ? "Haz clic en el botón para continuar."
              : "Estamos generando tu enlace seguro. Espera un momento."}
          </p>

          {/* Zona central: círculo o botón */}
          <div className="flex flex-col items-center gap-6 min-h-[240px] justify-center">
            {!done && ready ? (
              <>
                <CountdownCircle remaining={remaining} total={total} />
                <p className="text-neutral-400 text-sm text-center">
                  Serás redirigido en{" "}
                  <span className="text-white font-semibold">{remaining}</span>{" "}
                  {remaining === 1 ? "segundo" : "segundos"}...
                </p>
              </>
            ) : !ready ? (
              // Esqueleto mientras validamos (evita parpadeo)
              <div className="w-[200px] h-[200px] rounded-full border-8 border-neutral-800 animate-pulse" />
            ) : (
              // Botón "Continuar"
              <button
                type="button"
                onClick={handleContinue}
                className="animate-fade-in-up w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 transition-colors px-8 py-4 text-white font-semibold text-lg shadow-lg shadow-blue-600/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                Continuar a la descarga
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          {/* Info inferior: destino + contador de descargas */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-600">
            <span className="truncate max-w-full">
              Destino:{" "}
              <span className="text-neutral-400">
                {getDomain(rawUrl) || "—"}
              </span>
            </span>
            <span className="shrink-0">
              🔒 {formatNumber(FAKE_TODAY_DOWNLOADS)} descargas hoy
            </span>
          </div>
        </div>
      </section>

      {/* ======================= ANUNCIOS ======================= */}
      <section className="w-full max-w-4xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdPlaceholder
            label="Anuncio 1 — reemplazar con Adsterra / Monetag"
            className="h-24 sm:h-28"
          />
          <AdPlaceholder
            label="Anuncio 2 — reemplazar con Adsterra / Monetag"
            className="h-24 sm:h-28"
          />
          <AdPlaceholder
            label="Anuncio 3 — reemplazar con Adsterra / Monetag"
            className="h-24 sm:h-28"
          />
          <AdPlaceholder
            label="Anuncio 4 — reemplazar con Adsterra / Monetag"
            className="h-24 sm:h-28"
          />
        </div>
      </section>

      {/* ======================= POSTS INTERESANTES ======================= */}
      <InterestingPosts />

      {/* ======================= PIE DE PÁGINA ======================= */}
      <Footer />
    </main>
  );
}

// -------------------------------------------------------------
// Export por defecto: envoltorio con Suspense (requerido por
// useSearchParams en el App Router)
// -------------------------------------------------------------
export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-neutral-800 border-t-blue-600 animate-spin" />
        </main>
      }
    >
      <DownloadGate />
    </Suspense>
  );
}