"use client";

// =============================================================
// Círculo de cuenta regresiva con anillo de progreso SVG
// =============================================================

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
  const SIZE = 200;
  const STROKE = 8;
  const RADIUS = (SIZE - STROKE) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  // Progreso de 0 a 1 (1 = círculo completo, 0 = vacío)
  const progress = total > 0 ? Math.max(0, remaining) / total : 0;

  // Desplazamiento del trazo: cuánto del anillo se "oculta"
  const dashOffset = CIRCUMFERENCE * (1 - progress);

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
        {/* Anillo de fondo (gris) */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="transparent"
          stroke="#1f2937"
          strokeWidth={STROKE}
        />

        {/* Anillo de progreso (azul) */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="transparent"
          stroke="#2563eb"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          strokeDashoffset={dashOffset}
          style={{
            transition: "stroke-dashoffset 1s linear",
            // Pequeño brillo para dar sensación premium
            filter: "drop-shadow(0 0 6px rgba(37, 99, 235, 0.45))",
          }}
        />
      </svg>

      {/* Número central */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold text-white tabular-nums">
          {remaining}
        </span>
        <span className="text-xs uppercase tracking-widest text-neutral-500 mt-1">
          seg
        </span>
      </div>
    </div>
  );
}