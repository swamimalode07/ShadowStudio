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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

export type PreviewShape = "card" | "button" | "input";


export default function ShadowStudio() {
  const [lights, setLights] = useState<Light[]>([DEFAULT_LIGHT]);
  const [activeLightId, setActiveLightId] = useState<string>(DEFAULT_LIGHT.id);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 });
  const nextIdRef = useRef(2);
  const [codeSheetOpen, setCodeSheetOpen] = useState(false);
  const [previewShape, setPreviewShape] = useState<PreviewShape>("card");

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
      shadowType: "box-shadow",
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

  const handleShadowTypeChange = useCallback(
    (shadowType: ShadowType) => {
      setLights((prev) =>
        prev.map((l) => (l.id === activeLightId ? { ...l, shadowType } : l))
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
        shadowType: l.shadowType ?? preset.shadowType,
        config: l.config ?? preset.config,
      }));
      setLights(scaledLights);
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
            <svg width="30" height="30" viewBox="0 0 50 58" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect y="8" width="43" height="50" rx="3" fill="#313131" />s
              <rect x="7" width="43" height="50" rx="3" fill="url(#paint0_linear_749_58)" />
              <defs>
                <linearGradient id="paint0_linear_749_58" x1="46.13" y1="1" x2="2.90561" y2="42.4954" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#5C5C5C" />
                  <stop offset="0.528846" stopColor="#999999" />
                  <stop offset="0.975962" stopColor="#626262" />
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
          <ThemeSwitcher />
            {/* <PresetBar onApplyPreset={handleApplyPreset} /> */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="lg" className="rounded-lg border-none font-semibold bg-muted  gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="currentColor" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" strokeLinejoin="round"></path>
                    <path d="M8.5 10C7.67157 10 7 9.32843 7 8.5C7 7.67157 7.67157 7 8.5 7C9.32843 7 10 7.67157 10 8.5C10 9.32843 9.32843 10 8.5 10Z"></path>
                    <path d="M15.5 17C16.3284 17 17 16.3284 17 15.5C17 14.6716 16.3284 14 15.5 14C14.6716 14 14 14.6716 14 15.5C14 16.3284 14.6716 17 15.5 17Z"></path>
                    <path d="M10 8.5L17 8.5" strokeLinecap="round"></path>
                    <path d="M14 15.5L7 15.5" strokeLinecap="round"></path>
                  </svg>
                  Select Preview Component
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[200px] p-1.5">

                <DropdownMenuRadioGroup value={previewShape} onValueChange={(v) => setPreviewShape(v as PreviewShape)}>
                  <DropdownMenuRadioItem value="card" className="text-sm min-h-9 px-2.5">Card</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="button" className="text-sm min-h-9 px-2.5">Button</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="input" className="text-sm min-h-9 px-2.5">Input</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button onClick={handleReset} variant="outline" size="lg" className="rounded-sm bg-muted border-none font-semibold">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rotate-ccw-icon lucide-rotate-ccw"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
              Reset All
            </Button>
          </div>
        </header>

        {/* Canvas */}
        <div className="flex-1 min-h-0 bg-background">
          <Canvas
            lights={lights}
            shadows={shadows}
            canvasRef={canvasRef}
            onLightMove={handleLightMove}
            activeLightId={activeLightId}
            onActiveLightChange={setActiveLightId}
            previewShape={previewShape}
          />
        </div>
      </div>

      <Sidebar
        config={activeLight?.config ?? DEFAULT_CONFIG}
        onConfigChange={handleConfigChange}
        shadowType={activeLight?.shadowType ?? "box-shadow"}
        onShadowTypeChange={handleShadowTypeChange}
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
        open={codeSheetOpen}
        onClose={() => setCodeSheetOpen(false)}
      />
    </div>
  );
}
