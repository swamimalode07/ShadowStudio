"use client";

import { useState, useCallback, useRef } from "react";
import type { Light, ShadowType, ComputedShadow } from "./types";
import { generateCSSValue } from "./shadow-math";
import LightSource from "./LightSource";

interface CanvasProps {
  lights: Light[];
  shadows: ComputedShadow[];
  shadowType: ShadowType;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  onLightMove: (id: string, x: number, y: number) => void;
  activeLightId: string | null;
  onActiveLightChange: (id: string) => void;
}

export default function Canvas({
  lights,
  shadows,
  shadowType,
  canvasRef,
  onLightMove,
  activeLightId,
  onActiveLightChange,
}: CanvasProps) {
  const [draggingLightId, setDraggingLightId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getCanvasPosition = useCallback(
    (e: React.PointerEvent) => {
      const el = canvasRef.current;
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    },
    [canvasRef]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      const pos = getCanvasPosition(e);
      if (!pos) return;

      let closestLight: Light | null = null;
      let closestDist = 30;
      for (const light of lights) {
        const dist = Math.sqrt(
          (pos.x - light.x) ** 2 + (pos.y - light.y) ** 2
        );
        if (dist < closestDist) {
          closestDist = dist;
          closestLight = light;
        }
      }

      if (closestLight) {
        setDraggingLightId(closestLight.id);
        onActiveLightChange(closestLight.id);
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        e.preventDefault();
      }
    },
    [lights, onActiveLightChange, getCanvasPosition]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingLightId) return;
      const pos = getCanvasPosition(e);
      if (!pos) return;

      const el = canvasRef.current;
      if (!el) return;

      const clampedX = Math.max(0, Math.min(pos.x, el.offsetWidth));
      const clampedY = Math.max(0, Math.min(pos.y, el.offsetHeight));

      onLightMove(draggingLightId, clampedX, clampedY);
    },
    [draggingLightId, onLightMove, getCanvasPosition, canvasRef]
  );

  const handlePointerUp = useCallback(() => {
    setDraggingLightId(null);
  }, []);

  const shadowStyle = buildShadowStyle(shadows, shadowType);

  return (
    <div
      ref={(el) => {
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        if (canvasRef && "current" in canvasRef) {
          (canvasRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }
      }}
      className="relative w-full h-full select-none overflow-hidden"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        cursor: draggingLightId ? "grabbing" : "default",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Connection lines from lights to center */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {lights.map((light) => {
          const el = canvasRef.current;
          if (!el) return null;
          const cx = el.offsetWidth / 2;
          const cy = el.offsetHeight / 2;
          return (
            <line
              key={light.id}
              x1={light.x}
              y1={light.y}
              x2={cx}
              y2={cy}
              stroke={
                activeLightId === light.id
                  ? "rgba(255,255,255,0.12)"
                  : "rgba(255,255,255,0.05)"
              }
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          );
        })}
      </svg>

      {/* The card / preview object */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {shadowType === "text-shadow" ? (
          <div
            className="w-48 h-32 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center"
            style={shadowStyle}
          >
            <span
              className="text-3xl font-bold text-zinc-100"
              style={shadowStyle}
            >
              Shadow
            </span>
          </div>
        ) : (
          <div
            className="w-48 h-32 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center"
            style={shadowStyle}
          >
            <span className="text-sm text-zinc-400">Preview</span>
          </div>
        )}
      </div>

      {/* Light sources */}
      {lights.map((light) => (
        <LightSource
          key={light.id}
          light={light}
          isActive={activeLightId === light.id}
        />
      ))}

      {/* Drag hint */}
      {!draggingLightId && lights.length > 0 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-zinc-600 pointer-events-none">
          Drag the light to change the shadow
        </div>
      )}
    </div>
  );
}

function buildShadowStyle(
  shadows: ComputedShadow[],
  shadowType: ShadowType
): React.CSSProperties {
  if (shadows.length === 0) return {};
  const value = generateCSSValue(shadows, shadowType);

  switch (shadowType) {
    case "box-shadow":
      return { boxShadow: value };
    case "text-shadow":
      return { textShadow: value };
    case "drop-shadow":
      return { filter: value };
  }
}
