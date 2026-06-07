"use client";

import type { Light, ShadowConfig, ShadowType } from "./types";
import { MAX_LIGHTS } from "./types";
import { ElasticSlider } from "@/components/elastic-slider";

interface SidebarProps {
  shadowType: ShadowType;
  onShadowTypeChange: (type: ShadowType) => void;
  config: ShadowConfig;
  onConfigChange: (config: ShadowConfig) => void;
  lights: Light[];
  activeLightId: string;
  onActiveLightChange: (id: string) => void;
  onLightColorChange: (color: string) => void;
  onLightIntensityChange: (intensity: number) => void;
  onAddLight: () => void;
  onRemoveLight: (id: string) => void;
}

const SHADOW_TYPES: { value: ShadowType; label: string }[] = [
  { value: "box-shadow", label: "Box Shadow" },
  { value: "drop-shadow", label: "Drop Shadow" },
  { value: "text-shadow", label: "Text Shadow" },
  { value: "inset", label: "Inset" },
];

export default function Sidebar({
  shadowType,
  onShadowTypeChange,
  config,
  onConfigChange,
  lights,
  activeLightId,
  onActiveLightChange,
  onLightColorChange,
  onLightIntensityChange,
  onAddLight,
  onRemoveLight,
}: SidebarProps) {
  const activeLight = lights.find((l) => l.id === activeLightId);

  return (
    <aside className="w-74 shrink-0 border-l border-zinc-800 bg-muted mt-2 mr-2 mb-2 rounded-lg overflow-y-auto flex flex-col">
      {/* Shadow Type */}
      <section className="p-4 border-b border-border">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Shadow Type
        </h2>
        <div className="grid grid-cols-2 gap-1.5">
          {SHADOW_TYPES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onShadowTypeChange(value)}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                shadowType === value
                  ? "bg-background text-foreground"
                  : "bg-none text-muted-foreground hover:bg-muted-foreground/10 hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Shadow Controls */}
      <section className="p-4 border-b border-border flex flex-col gap-2">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Shadow
        </h2>
        <ElasticSlider
          label="Blur"
          value={config.blurMultiplier}
          min={0}
          max={3}
          step={0.1}
          onValueChange={(v) => onConfigChange({ ...config, blurMultiplier: v })}
        />
        <ElasticSlider
          label="Spread"
          value={config.spreadMultiplier}
          min={0}
          max={2}
          step={0.1}
          onValueChange={(v) => onConfigChange({ ...config, spreadMultiplier: v })}
        />
        <ElasticSlider
          label="Distance"
          value={config.distanceMultiplier}
          min={0.1}
          max={3}
          step={0.1}
          onValueChange={(v) => onConfigChange({ ...config, distanceMultiplier: v })}
        />
        <ElasticSlider
          label="Opacity"
          value={config.opacityMultiplier}
          min={0.1}
          max={1}
          step={0.05}
          onValueChange={(v) => onConfigChange({ ...config, opacityMultiplier: v })}
        />
      </section>

      {/* Lights */}
      <section className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Lights
          </h2>
          <button
            onClick={onAddLight}
            disabled={lights.length >= MAX_LIGHTS}
            className="px-2 py-1 text-xs font-medium rounded-md bg-muted text-muted-foreground hover:bg-muted-foreground/10 hover:text-foreground
              disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            + Add
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          {lights.map((light) => (
            <div
              key={light.id}
              onClick={() => onActiveLightChange(light.id)}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer transition-colors ${
                activeLightId === light.id
                  ? "bg-muted ring-1 ring-border"
                  : "hover:bg-zinc-900"
              }`}
            >
              <div
                className="w-4 h-4 rounded-full shrink-0 border border-border"
                style={{
                  backgroundColor: light.color === "#000000" ? "#fbbf24" : light.color,
                }}
              />
                <span className="text-xs text-muted-foreground flex-1 truncate">
                {light.id}
              </span>
              {lights.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveLight(light.id);
                  }}
                  className="text-muted-foreground hover:text-red-400 transition-colors text-sm leading-none"
                >
                  &times;
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Active Light Controls */}
        {activeLight && (
            <div className="mt-2 pt-3 border-t border-border flex flex-col gap-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Active Light
            </h3>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-muted-foreground">Color</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={activeLight.color}
                  onChange={(e) => onLightColorChange(e.target.value)}
                  className="w-8 h-8 rounded-md border border-border bg-transparent cursor-pointer
                    [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:rounded-sm [&::-webkit-color-swatch]:border-none"
                />
                <span className="text-xs font-mono text-muted-foreground">
                  {activeLight.color}
                </span>
              </div>
            </div>
            <ElasticSlider
              label="Intensity"
              value={activeLight.intensity}
              min={0.1}
              max={1}
              step={0.05}
              onValueChange={onLightIntensityChange}
            />
          </div>
        )}
      </section>

    </aside>
  );
}
