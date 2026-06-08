"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import type { Light } from "./types";
import { HugeiconsIcon } from "@hugeicons/react";
import { Idea01Icon } from "@hugeicons/core-free-icons";

const PROXIMITY_THRESHOLD = 100;

interface LightSourceProps {
  light: Light;
  isActive: boolean;
  distanceToCenter: number;
}

export default function LightSource({ light, isActive, distanceToCenter }: LightSourceProps) {
  const [hasWiggled, setHasWiggled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHasWiggled(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const isNearCenter = distanceToCenter < PROXIMITY_THRESHOLD;
  const proximityRatio = Math.max(0, Math.min(1, (PROXIMITY_THRESHOLD - distanceToCenter) / PROXIMITY_THRESHOLD));

  return (
    <div
      className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2"
      style={{ left: light.x, top: light.y }}
    >
      <motion.div
        className="relative flex items-center justify-center rounded-full cursor-grab active:cursor-grabbing"
        animate={{
          width: isNearCenter ? 12 : 48,
          height: isNearCenter ? 12 : 48,
          backgroundColor: isNearCenter
            ? `color-mix(in srgb, ${light.color} 60%, transparent)`
            : `color-mix(in srgb, ${light.color} 15%, transparent)`,
          scale: hasWiggled ? (isActive && !isNearCenter ? 1.1 : 1) : 1,
          rotate: hasWiggled ? 0 : [0, -12, 10, -8, 6, -3, 0],
        }}
        initial={{ scale: 0, width: 48, height: 48 }}
        transition={{
          width: { type: "spring", stiffness: 400, damping: 25 },
          height: { type: "spring", stiffness: 400, damping: 25 },
          backgroundColor: { duration: 0.2 },
          scale: { type: "spring", stiffness: 300, damping: 20 },
          rotate: hasWiggled ? undefined : { duration: 0.6, delay: 0.4, ease: "easeInOut" },
        }}
      >
        <motion.div
          animate={{ opacity: isNearCenter ? 0 : 1, scale: isNearCenter ? 0.3 : 1 }}
          transition={{ duration: 0.15 }}
        >
          <HugeiconsIcon icon={Idea01Icon} size={32} color={light.color} />
        </motion.div>
      </motion.div>
    </div>
  );
}
