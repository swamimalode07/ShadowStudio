"use client";

import type { Light } from "./types";

interface LightSourceProps {
  light: Light;
  isActive: boolean;
}

export default function LightSource({ light, isActive }: LightSourceProps) {
  return (
    <div
      className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2"
      style={{ left: light.x, top: light.y }}
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 -m-3 rounded-full opacity-30 blur-md"
        style={{ backgroundColor: light.color === "#000000" ? "#fbbf24" : light.color }}
      />
      {/* Light indicator */}
      <div
        className={`relative w-7 h-7 rounded-full border-2 cursor-grab active:cursor-grabbing transition-shadow ${
          isActive
            ? "border-white shadow-[0_0_12px_rgba(255,255,255,0.5)]"
            : "border-zinc-400"
        }`}
        style={{
          backgroundColor: light.color === "#000000" ? "#fbbf24" : light.color,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke={light.color === "#000000" ? "#000" : "#fff"}
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="12" cy="12" r="4" />
            <line x1="12" y1="2" x2="12" y2="6" />
            <line x1="12" y1="18" x2="12" y2="22" />
            <line x1="2" y1="12" x2="6" y2="12" />
            <line x1="18" y1="12" x2="22" y2="12" />
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
          </svg>
        </div>
      </div>
    </div>
  );
}
