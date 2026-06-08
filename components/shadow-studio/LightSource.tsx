"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import type { Light } from "./types";
import { HugeiconsIcon } from "@hugeicons/react";
import { Idea01Icon } from "@hugeicons/core-free-icons";

interface LightSourceProps {
  light: Light;
  isActive: boolean;
}

export default function LightSource({ light, isActive }: LightSourceProps) {
  const [hasWiggled, setHasWiggled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHasWiggled(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2"
      style={{ left: light.x, top: light.y }}
    >
      <motion.div
        className={`relative flex items-center justify-center w-12 h-12 rounded-full cursor-grab active:cursor-grabbing ${
          isActive ? "scale-110" : "scale-100"
        }`}
        style={{
          backgroundColor: `color-mix(in srgb, ${light.color} 15%, transparent)`,
        }}
        initial={{ scale: 0, rotate: 0 }}
        animate={
          hasWiggled
            ? { scale: isActive ? 1.1 : 1, rotate: 0 }
            : {
                scale: isActive ? 1.1 : 1,
                rotate: [0, -12, 10, -8, 6, -3, 0],
              }
        }
        transition={
          hasWiggled
            ? { type: "spring", stiffness: 300, damping: 20 }
            : {
                scale: { type: "spring", stiffness: 400, damping: 15, delay: 0.1 },
                rotate: { duration: 0.6, delay: 0.4, ease: "easeInOut" },
              }
        }
      >
        <HugeiconsIcon icon={Idea01Icon} size={32} color={light.color} />
      </motion.div>
    </div>
  );
}
