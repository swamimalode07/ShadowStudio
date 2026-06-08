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
import { HugeiconsIcon } from "@hugeicons/react";
import { Copy01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";


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

  const handleReset = useCallback(() => {
    setLights([{ ...DEFAULT_LIGHT }]);
    setShadowType("box-shadow");
    setActiveLightId(DEFAULT_LIGHT.id);
    nextIdRef.current = 2;
  }, []);

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
    <div className="flex h-screen bg-transparent text-foreground font-sans">
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-3 shrink-0">
          <div className="flex items-center gap-3">
            <svg width="19" height="36" viewBox="0 0 59 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 33.264C0 30.1463 2.06195 27.4043 5.05722 26.539L35.9258 17.6214C40.4412 16.317 44.9336 19.7447 44.8679 24.4443L44.0705 81.4567C44.0284 84.4687 42.0641 87.116 39.1936 88.0293L9.12243 97.5974C4.60781 99.0339 0 95.6646 0 90.9269V33.264Z" fill="#313131" />
              <path d="M13.5 18.264C13.5 15.1463 15.562 12.4043 18.5572 11.539L49.4258 2.62143C53.9412 1.31698 58.4336 4.74475 58.3679 9.44432L57.5705 66.4567C57.5284 69.4687 55.5641 72.116 52.6936 73.0293L22.6224 82.5974C18.1078 84.0339 13.5 80.6646 13.5 75.9269V18.264Z" fill="url(#paint0_linear_747_30)" />
              <defs>
                <linearGradient id="paint0_linear_747_30" x1="61" y1="-2.66936e-07" x2="36" y2="85.5" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#5A5A5A" />
                  <stop offset="0.49101" stopColor="#999999" />
                  <stop offset="1" stopColor="#5C5C5C" />
                </linearGradient>
              </defs>
            </svg>

            <h1 className="text-lg font-semibold tracking-tight">
              Shadow Studio
            </h1>
            {/* <span className="text-xs text-muted-foreground hidden sm:inline">
              Drag the light to cast shadows
            </span> */}
          </div>
          <div className="flex items-center gap-3">
            {/* <PresetBar onApplyPreset={handleApplyPreset} /> */}
            <ThemeSwitcher />

            <Button onClick={handleReset} variant="outline" size="lg" className="rounded-sm font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rotate-ccw-icon lucide-rotate-ccw"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              Reset All 
            </Button>
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
        onCopyCode={() => setCodeSheetOpen(true)}
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
