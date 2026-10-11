"use client";

// =============================================================
// Círculo de cuenta regresiva con diseño de reloj mejorado
// =============================================================

import { useEffect, useState } from "react";

interface CountdownCircleProps {
  /** Segundos restantes que se muestran en el centro */
  remaining: number;
  /** Duración total del conteo (para calcular el progreso del anillo) */
  total: number;
}

export default function CountdownCircle({
  remaining,
  total,
}: CountdownCircleProps) {
  // Dimensiones del SVG (viewBox cuadrado)
  const SIZE = 220;
  const STROKE = 10;
  const RADIUS = (SIZE - STROKE) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  // Progreso de 0 a 1 (1 = círculo completo, 0 = vacío)
  const progress = total > 0 ? Math.max(0, remaining) / total : 0;

  // Desplazamiento del trazo: cuánto del anillo se "oculta"
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  // Animación de pulso en el número (cambia cada segundo)
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 200);
    return () => clearTimeout(t);
  }, [remaining]);

  return (
    <div
      className="relative"
      style={{ width: SIZE, height: SIZE }}
      role="timer"
      aria-live="polite"
      aria-label={`Faltan ${remaining} segundos`}
    >
      {/* SVG con el anillo de progreso */}
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="-rotate-90"
      >
        {/* Definición del gradiente azul */}
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>

        {/* Anillo de fondo (gris oscuro) */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="transparent"
          stroke="#1f2937"
          strokeWidth={STROKE}
        />

        {/* Anillo de progreso (azul con gradiente) */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="transparent"
          stroke="url(#ringGradient)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          strokeDashoffset={dashOffset}
          style={{
            transition: "stroke-dashoffset 1s linear",
            filter: "drop-shadow(0 0 8px rgba(37, 99, 235, 0.55))",
          }}
        />
      </svg>

      {/* Contenido central */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Icono de reloj/arena */}
        <svg
          className="w-6 h-6 text-blue-500 mb-2 opacity-80"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Reloj */}
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>

        {/* Número grande con animación de pulso */}
        <span
          className={`text-6xl font-black text-white tabular-nums transition-transform duration-200 ${
            pulse ? "scale-110" : "scale-100"
          }`}
        >
          {remaining}
        </span>

        {/* Etiqueta inferior */}
        <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 mt-1 font-semibold">
          {remaining === 1 ? "segundo" : "segundos"}
        </span>
      </div>
    </div>
  );
}