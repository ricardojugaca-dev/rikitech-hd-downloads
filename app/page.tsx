"use client";
import Image from "next/image";
import Navbar from "@/components/Navbar";

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
  isValidDownloadUrl,
} from "@/lib/utils";

// Duración normal y duración reducida si el usuario ya pasó por aquí
const FULL_DURATION = 10;
const SHORT_DURATION = 3;


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
    // 🧪 MODO DESARROLLO: si estamos en local sin ?url=, usamos una URL de prueba
    const isDev = typeof window !== "undefined" && window.location.hostname === "localhost";
    
    if (!rawUrl && isDev) {
      // En desarrollo, mostramos el contador igual con una URL de prueba
      let duration = FULL_DURATION;
      try {
        if (localStorage.getItem(VISITED_KEY) === "1") {
          duration = SHORT_DURATION;
        }
      } catch {}
      setTotal(duration);
      setRemaining(duration);
      setReady(true);
      return;
    }

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
    } catch {}

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
    // En modo desarrollo sin URL, mostramos una alerta
    if (!rawUrl) {
      alert("🧪 Modo desarrollo: aquí iría la URL real de descarga.");
      return;
    }
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
     <Navbar />
      {/* ======================= TARJETA CENTRAL ======================= */}
      <section className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl rounded-2xl border border-neutral-800 bg-neutral-950/70 backdrop-blur-sm p-6 sm:p-10 shadow-2xl shadow-black/40">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image
              src="/Logo.png"
              alt="RikiTechHD"
              width={56}
              height={56}
              className="rounded-xl"
            />
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

          {/* Redes sociales destacadas */}
            <div className="mt-8 pt-6 border-t border-neutral-900">
              <p className="text-center text-xs text-neutral-500 mb-3">
                Síguenos para más contenido
              </p>
              <div className="flex items-center justify-center gap-3">
                {/* Facebook */}
                <a
                  href="https://facebook.com/rikitech"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Facebook"
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#1877F2]/10 text-[#1877F2] group-hover:bg-[#1877F2] group-hover:text-white flex items-center justify-center transition-all duration-200 group-hover:scale-110 shadow-sm">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M22 12.07C22 6.5 17.52 2 12 2S2 6.5 2 12.07C2 17.1 5.66 21.25 10.44 22v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.5-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.9h2.78l-.44 2.9h-2.34V22C18.34 21.25 22 17.1 22 12.07z" />
                    </svg>
                  </div>
                </a>

                {/* X */}
                <a
                  href="https://x.com/rikitechhd"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="X (Twitter)"
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-11 h-11 rounded-xl bg-neutral-800 text-neutral-300 group-hover:bg-black group-hover:text-white flex items-center justify-center transition-all duration-200 group-hover:scale-110 shadow-sm border border-neutral-800">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                    </svg>
                  </div>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com/@rikitechhd"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="YouTube"
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#FF0000]/10 text-[#FF0000] group-hover:bg-[#FF0000] group-hover:text-white flex items-center justify-center transition-all duration-200 group-hover:scale-110 shadow-sm">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z" />
                    </svg>
                  </div>
                </a>

                {/* Telegram */}
                <a
                  href="https://t.me/rikitechhd"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Telegram"
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#24A1DE]/10 text-[#24A1DE] group-hover:bg-[#24A1DE] group-hover:text-white flex items-center justify-center transition-all duration-200 group-hover:scale-110 shadow-sm">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-1.97 9.29c-.15.66-.54.82-1.09.51l-3.02-2.23-1.46 1.41c-.16.16-.3.3-.61.3l.22-3.08 5.61-5.07c.24-.22-.05-.34-.38-.13l-6.93 4.36-2.98-.93c-.65-.2-.66-.65.14-.96l11.66-4.49c.54-.2 1.01.13.82 1.02z" />
                    </svg>
                  </div>
                </a>
              </div>
            </div>

         
        </div>
      </section>

      {/* ======================= ANUNCIOS ======================= */}
        <section className="w-full max-w-md mx-auto px-4 pb-8 space-y-4">
          {/* Anuncio 1: Native Banner (arriba) */}
          <AdPlaceholder
            html={`
              <script async="async" data-cfasync="false" src="https://pl31767627.profitableratecpmnetwork.com/4c4c564fe15ccb1e3c16319487c38cd6/invoke.js"></script>
                <div id="container-4c4c564fe15ccb1e3c16319487c38cd6"></div>
            `}
            className="min-h-[90px]"
          />

          {/* Anuncio 2: Banner 728x90 (Desktop) / 320x50 (Móvil) */}
          <div className="hidden sm:block">
            <AdPlaceholder
              html={`
                <script>
                atOptions = {
                  'key' : '3f3848307050e98545d969ecca6d3955',
                  'format' : 'iframe',
                  'height' : 90,
                  'width' : 728,
                  'params' : {}
                };
              </script>
              <script src="https://www.highrevenueformat.com/3f3848307050e98545d969ecca6d3955/invoke.js"></script>
              `}
              className="min-h-[90px]"
            />
          </div>
          <div className="block sm:hidden">
            <AdPlaceholder
              html={`
                <!-- 👇 PEGA AQUÍ EL CÓDIGO DEL BANNER 320x50 -->
              `}
              className="min-h-[50px]"
            />
          </div>

          {/* Anuncios 3 y 4: dos banners 300x250 lado a lado */}
          <div className="grid grid-cols-2 gap-4">
            <AdPlaceholder
              html={`
                <!-- 👇 PEGA AQUÍ EL CÓDIGO DEL BANNER 300x250 #1 -->
              `}
              className="min-h-[250px]"
            />
            <AdPlaceholder
              html={`
                <!-- 👇 PEGA AQUÍ EL CÓDIGO DEL BANNER 300x250 #2 -->
              `}
              className="min-h-[250px]"
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