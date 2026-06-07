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
              className="stroke-neutral-300 dark:stroke-neutral-700"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          );
        })}
      </svg>

      {/* The card / preview object */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {shadowType === "text-shadow" ? (
          <span
            className="text-4xl font-bold text-foreground"
            style={shadowStyle}
          >
            Shadow
          </span>
        ) : (
          <div
            className="w-72 rounded-xl bg-card border border-border overflow-hidden"
            style={shadowStyle}
          >
            <div className="p-4 flex flex-col gap-3">
              {/* Header row */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-sm font-semibold text-card-foreground leading-none">Alex Morgan</span>
                  <span className="text-xs text-muted-foreground leading-none">Product Designer</span>
                </div>
              </div>
              {/* Body */}
              <p className="text-xs text-muted-foreground leading-relaxed">
                Working on the new dashboard components. Will share the Figma link once the review is done.
              </p>
              {/* Footer */}
              <div className="flex items-center gap-2 pt-1">
                <div className="px-2.5 py-1 rounded-md bg-primary text-primary-foreground text-[10px] font-medium">
                  View Profile
                </div>
                <div className="px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-[10px] font-medium">
                  Message
                </div>
              </div>
            </div>
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
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground pointer-events-none">
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
    case "inset":
      return { boxShadow: value };
  }
}
