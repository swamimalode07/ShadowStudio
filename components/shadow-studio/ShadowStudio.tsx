"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import type { Light, ShadowConfig, ShadowType, Preset } from "./types";
import { DEFAULT_CONFIG, DEFAULT_LIGHT, LIGHT_COLORS, MAX_LIGHTS } from "./types";
import { computeShadow } from "./shadow-math";
import Canvas from "./Canvas";
import CodeOutput from "./CodeOutput";
import PresetBar from "./PresetBar";
import Sidebar from "./Sidebar";
import { ThemeSwitcher } from "@/components/theme-switcher"


export default function ShadowStudio() {
  const [lights, setLights] = useState<Light[]>([DEFAULT_LIGHT]);
  const [shadowType, setShadowType] = useState<ShadowType>("box-shadow");
  const [activeLightId, setActiveLightId] = useState<string>(DEFAULT_LIGHT.id);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 });
  const nextIdRef = useRef(2);
  const [codeSheetOpen, setCodeSheetOpen] = useState(false);

  const activeLight = lights.find((l) => l.id === activeLightId);

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
      config: { ...DEFAULT_CONFIG },
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

  const handleLightColorChange = useCallback(
    (color: string) => {
      setLights((prev) =>
        prev.map((l) => (l.id === activeLightId ? { ...l, color } : l))
      );
    },
    [activeLightId]
  );

  const handleLightIntensityChange = useCallback(
    (intensity: number) => {
      setLights((prev) =>
        prev.map((l) => (l.id === activeLightId ? { ...l, intensity } : l))
      );
    },
    [activeLightId]
  );

  const handleConfigChange = useCallback(
    (config: ShadowConfig) => {
      setLights((prev) =>
        prev.map((l) => (l.id === activeLightId ? { ...l, config } : l))
      );
    },
    [activeLightId]
  );

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
    () => lights.map((light) => computeShadow(light, cardCenter)),
    [lights, cardCenter]
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
        config: l.config ?? preset.config,
      }));
      setLights(scaledLights);
      setShadowType(preset.shadowType);
      setActiveLightId(scaledLights[0].id);
      nextIdRef.current = scaledLights.length + 1;
    },
    [canvasSize]
  );

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans">
      <div className="flex flex-col flex-1 min-w-0">
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
          <div className="flex items-center gap-3">
            {/* <PresetBar onApplyPreset={handleApplyPreset} /> */}
            <ThemeSwitcher />
            
            <button
              onClick={() => setCodeSheetOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg bg-zinc-100 text-zinc-900 hover:bg-white transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
              Copy Code
            </button>
          </div>
        </header>

        {/* Canvas */}
        <div className="flex-1 min-h-0 bg-background">
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
      </div>

      <Sidebar
        shadowType={shadowType}
        onShadowTypeChange={setShadowType}
        config={activeLight?.config ?? DEFAULT_CONFIG}
        onConfigChange={handleConfigChange}
        lights={lights}
        activeLightId={activeLightId}
        onActiveLightChange={setActiveLightId}
        onLightColorChange={handleLightColorChange}
        onLightIntensityChange={handleLightIntensityChange}
        onAddLight={handleLightAdd}
        onRemoveLight={handleLightRemove}
      />

      <CodeOutput
        shadows={shadows}
        shadowType={shadowType}
        open={codeSheetOpen}
        onClose={() => setCodeSheetOpen(false)}
      />
    </div>
  );
}
