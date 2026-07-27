import React, { useId } from "react";

const SHIELD_PATH =
  "M50 4 L88 18 L88 50 C88 76 70 93 50 98 C30 93 12 76 12 50 L12 18 Z";

export default function ShieldProgress({ percent, size = 140 }) {
  const clipId = useId();
  const pct = Math.max(0, Math.min(1, percent));
  const fillY = 100 - pct * 100;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox="0 0 100 100">
        <defs>
          <clipPath id={clipId}>
            <rect x="0" y={fillY} width="100" height={100 - fillY} />
          </clipPath>
        </defs>
        {/* contorno vazio */}
        <path d={SHIELD_PATH} fill="#EEF1F4" stroke="#E4E7EC" strokeWidth="1.5" />
        {/* preenchimento conforme o progresso */}
        <path d={SHIELD_PATH} fill="#0E7A57" clipPath={`url(#${clipId})`} />
        {/* contorno por cima, sempre visível */}
        <path d={SHIELD_PATH} fill="none" stroke="#0A5C41" strokeWidth="2" />
      </svg>
      <p className="font-display text-2xl font-bold text-ink -mt-2">{Math.round(pct * 100)}%</p>
      <p className="text-xs text-muted">da meta protegida</p>
    </div>
  );
}
