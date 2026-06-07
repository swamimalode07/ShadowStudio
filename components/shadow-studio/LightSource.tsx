"use client";

import Image from "next/image";
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
      <div
        className={`relative w-10 h-10 cursor-grab active:cursor-grabbing transition-transform ${
          isActive ? "scale-110" : "scale-100"
        }`}
      >
        <Image src="/image.png" alt="Light" width={40} height={40} draggable={false} />
        {/* Color dot */}
        <div
          className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background"
          style={{ backgroundColor: light.color }}
        />
      </div>
    </div>
  );
}
