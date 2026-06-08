"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import type { Light, ShadowConfig, ShadowType } from "./types";
import { MAX_LIGHTS } from "./types";
import { ElasticSlider } from "@/components/elastic-slider";
import { Button } from "@/components/ui/button";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import TailwindColorPicker from "./TailwindColorPicker";

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
  onReset: () => void;
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
  onReset,
}: SidebarProps) {
  const activeLight = lights.find((l) => l.id === activeLightId);

  return (
    <aside className="w-74 shrink-0 bg-sidebar mt-2 mr-2 mb-2 rounded-lg overflow-y-auto scrollbar-none flex flex-col">
      {/* Shadow Type */}
      <section className="p-4 border-b border-border">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Shadow Type
        </h2>
        <div className="grid grid-cols-2 gap-1.5">
          {SHADOW_TYPES.map(({ value, label }) => (
            <Button
              key={value}
              variant={shadowType === value ? "secondary" : "ghost"}
              size="lg"
              onClick={() => onShadowTypeChange(value)}
              className={shadowType === value ? "bg-background text-foreground" : "bg-muted-foreground/10"}
            >
              {label}
            </Button>
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
          <Button
            variant="secondary"
            size="default"
            onClick={onAddLight}
            disabled={lights.length >= MAX_LIGHTS}
            className="font-semibold"
          >
            + Add Light
          </Button>
        </div>

        <div className="flex flex-col gap-1.5">
          {lights.map((light) => (
            <div
              key={light.id}
              onClick={() => onActiveLightChange(light.id)}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer transition-colors ${
                activeLightId === light.id
                  ? "bg-muted"
                  : "hover:bg-muted-foreground/10"
              }`}
            >
              <div
                className="w-4 h-4 rounded-full shrink-0 border"
                style={{
                  backgroundColor: light.color,
                }}
              />
                <span className="text-xs text-muted-foreground flex-1 truncate">
                {light.id}
              </span>
              {lights.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveLight(light.id);
                  }}
                  className="text-muted-foreground hover:text-foreground hover:bg-none"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={2}/>
                </Button>
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
                <TailwindColorPicker
                  currentColor={activeLight.color}
                  onSelect={onLightColorChange}
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

      {/* Reset */}
      <div className="mt-auto p-1.5">
        <Button
          variant="destructive"
          size="lg"
          onClick={onReset}
          className="w-full font-semibold"
        >
          Reset All
        </Button>
      </div>
    </aside>
  );
}
