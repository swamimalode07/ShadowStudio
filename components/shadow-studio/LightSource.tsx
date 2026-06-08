"use client";

import Image from "next/image";
import type { Light } from "./types";
import { HugeiconsIcon } from "@hugeicons/react";
import { Idea01Icon } from "@hugeicons/core-free-icons";

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
        className={`relative flex items-center justify-center w-12 h-12 rounded-full cursor-grab active:cursor-grabbing transition-transform ${
          isActive ? "scale-110" : "scale-100"
        }`}
        style={{
          backgroundColor: `color-mix(in srgb, ${light.color} 15%, transparent)`,
        }}
      >
        <HugeiconsIcon icon={Idea01Icon} size={32} color={light.color} />
      </div>
    </div>
  );
}
