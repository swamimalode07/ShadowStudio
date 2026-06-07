"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useDialKit } from "dialkit";
import type { Light, ShadowConfig, ShadowType, Preset } from "./types";
import { DEFAULT_CONFIG, DEFAULT_LIGHT, LIGHT_COLORS, MAX_LIGHTS } from "./types";
import { computeShadow, generateFullCSS } from "./shadow-math";
import Canvas from "./Canvas";
import CodeOutput from "./CodeOutput";
import PresetBar from "./PresetBar";

export default function ShadowStudio() {
  const [lights, setLights] = useState<Light[]>([DEFAULT_LIGHT]);
  const [config, setConfig] = useState<ShadowConfig>(DEFAULT_CONFIG);
  const [shadowType, setShadowType] = useState<ShadowType>("box-shadow");
  const [activeLightId, setActiveLightId] = useState<string>(DEFAULT_LIGHT.id);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 });
  const nextIdRef = useRef(2);

  const handleLightAdd = useCallback(() => {
    if (lights.length >= MAX_LIGHTS) return;
    const id = `light-${nextIdRef.current++}`;
    const colorIndex = lights.length % LIGHT_COLORS.length;
    const angle = (lights.length * Math.PI) / 3;
    const radius = 120;
    const cardCenterNow = {
      x: canvasSize.width / 2,
      y: canvasSize.height / 2,
    };
    const newLight: Light = {
      id,
      x: cardCenterNow.x + Math.cos(angle) * radius,
      y: cardCenterNow.y + Math.sin(angle) * radius,
      color: LIGHT_COLORS[colorIndex],
      intensity: 0.8,
    };
    setLights((prev) => [...prev, newLight]);
    setActiveLightId(id);
  }, [lights.length, canvasSize]);

  const handleLightRemove = useCallback(
    (id: string) => {
      setLights((prev) => {
        if (prev.length <= 1) return prev;
        const next = prev.filter((l) => l.id !== id);
        if (activeLightId === id) {
          setActiveLightId(next[0].id);
        }
        return next;
      });
    },
    [activeLightId]
  );

  const dial = useDialKit("Shadow Studio", {
    type: {
      type: "select" as const,
      options: ["box-shadow", "drop-shadow", "text-shadow"],
      default: "box-shadow",
    },
    shadow: {
      blur: [config.blurMultiplier, 0, 3.0, 0.1],
      spread: [config.spreadMultiplier, 0.0, 2.0, 0.1],
      distance: [config.distanceMultiplier, 0.1, 3.0, 0.1],
      opacity: [config.opacityMultiplier, 0.1, 1.0, 0.05],
    },
    light: {
      color: lights.find((l) => l.id === activeLightId)?.color ?? "#000000",
      intensity: [
        lights.find((l) => l.id === activeLightId)?.intensity ?? 0.8,
        0.1,
        1.0,
        0.05,
      ],
    },
    addLight: { type: "action" as const },
    removeLight: { type: "action" as const },
  }, {
    shortcuts: {
      "shadow.blur": { key: "b", mode: "fine" as const },
      "shadow.spread": { key: "s", mode: "fine" as const },
      "shadow.distance": { key: "d", mode: "fine" as const },
      "shadow.opacity": { key: "o", mode: "fine" as const },
    },
    onAction: (action: string) => {
      if (action === "addLight") handleLightAdd();
      if (action === "removeLight" && activeLightId) handleLightRemove(activeLightId);
    },
  });

  useEffect(() => {
    const t = dial.type as string;
    if (t === "box-shadow" || t === "drop-shadow" || t === "text-shadow") {
      setShadowType(t);
    }
  }, [dial.type]);

  useEffect(() => {
    setConfig({
      blurMultiplier: dial.shadow.blur,
      spreadMultiplier: dial.shadow.spread,
      distanceMultiplier: dial.shadow.distance,
      opacityMultiplier: dial.shadow.opacity,
    });
  }, [dial.shadow.blur, dial.shadow.spread, dial.shadow.distance, dial.shadow.opacity]);

  useEffect(() => {
    if (!activeLightId) return;
    setLights((prev) =>
      prev.map((l) =>
        l.id === activeLightId
          ? { ...l, color: dial.light.color, intensity: dial.light.intensity }
          : l
      )
    );
  }, [dial.light.color, dial.light.intensity, activeLightId]);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setCanvasSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cardCenter = useMemo(
    () => ({ x: canvasSize.width / 2, y: canvasSize.height / 2 }),
    [canvasSize]
  );

  const shadows = useMemo(
    () => lights.map((light) => computeShadow(light, cardCenter, config)),
    [lights, cardCenter, config]
  );

  const cssString = useMemo(
    () => generateFullCSS(shadows, shadowType),
    [shadows, shadowType]
  );

  const handleLightMove = useCallback(
    (id: string, x: number, y: number) => {
      setLights((prev) =>
        prev.map((l) => (l.id === id ? { ...l, x, y } : l))
      );
    },
    []
  );

  const handleApplyPreset = useCallback(
    (preset: Preset) => {
      const scaleX = canvasSize.width / 600;
      const scaleY = canvasSize.height / 400;
      const scaledLights = preset.lights.map((l) => ({
        ...l,
        x: l.x * scaleX,
        y: l.y * scaleY,
      }));
      setLights(scaledLights);
      setConfig(preset.config);
      setShadowType(preset.shadowType);
      setActiveLightId(scaledLights[0].id);
      nextIdRef.current = scaledLights.length + 1;
    },
    [canvasSize]
  );

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold tracking-tight">
            Shadow Studio
          </h1>
          <span className="text-xs text-zinc-600 hidden sm:inline">
            Drag the light to cast shadows
          </span>
        </div>
        <PresetBar onApplyPreset={handleApplyPreset} />
      </header>

      {/* Canvas — full width */}
      <div className="flex-1 min-h-0 bg-zinc-900">
        <Canvas
          lights={lights}
          shadows={shadows}
          shadowType={shadowType}
          canvasRef={canvasRef}
          onLightMove={handleLightMove}
          activeLightId={activeLightId}
          onActiveLightChange={setActiveLightId}
        />
      </div>

      {/* Code output */}
      <div className="border-t border-zinc-800 p-4 shrink-0">
        <CodeOutput cssString={cssString} />
      </div>
    </div>
  );
}
