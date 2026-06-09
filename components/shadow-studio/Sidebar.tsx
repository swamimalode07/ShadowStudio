"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import type { Light, ShadowConfig, ShadowType } from "./types";
import { MAX_LIGHTS } from "./types";
import { ElasticSlider } from "@/components/elastic-slider";
import { Button } from "@/components/ui/button";
import { Cancel01Icon, CodeXmlIcon } from "@hugeicons/core-free-icons";
import TailwindColorPicker from "./TailwindColorPicker";

interface SidebarProps {
  config: ShadowConfig;
  onConfigChange: (config: ShadowConfig) => void;
  shadowType: ShadowType;
  onShadowTypeChange: (type: ShadowType) => void;
  lights: Light[];
  activeLightId: string;
  onActiveLightChange: (id: string) => void;
  onLightColorChange: (color: string) => void;
  onLightIntensityChange: (intensity: number) => void;
  onAddLight: () => void;
  onRemoveLight: (id: string) => void;
  onCopyCode: () => void;
  onViewExamples: () => void;
}

const SHADOW_TYPES: { value: ShadowType; label: string }[] = [
  { value: "box-shadow", label: "Box Shadow" },
  { value: "drop-shadow", label: "Drop Shadow" },
  { value: "text-shadow", label: "Text Shadow" },
  { value: "inset", label: "Inset" },
];

const TYPE_SHORT: Record<ShadowType, string> = {
  "box-shadow": "Box",
  "drop-shadow": "Drop",
  "text-shadow": "Text",
  "inset": "Inset",
};

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
  onCopyCode,
  onViewExamples,
}: SidebarProps) {
  const activeLight = lights.find((l) => l.id === activeLightId);

  return (
    <aside className="w-74 shrink-0 bg-sidebar mt-2 mr-2 mb-2 rounded-lg overflow-y-auto scrollbar-none flex flex-col">
      {/* Lights */}
      <section className="p-4 border-b border-border flex flex-col gap-3">
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
              <span className="text-[10px] text-muted-foreground/70 font-medium px-1.5 py-0.5 rounded bg-muted-foreground/5">
                {TYPE_SHORT[light.shadowType]}
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
      </section>

      {/* Active Light Settings */}
      {activeLight && (
        <section className="p-4 border-b border-border flex flex-col gap-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {activeLight.id}
          </h3>

          {/* Shadow Type (per-light) */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground">Shadow Type</span>
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
          </div>

          {/* Shadow Controls (per-light) */}
          <div className="flex flex-col gap-2">
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
          </div>

          {/* Color & Intensity */}
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
        </section>
      )}

      {/* Copy Code */}
      <div className="mt-auto p-2 flex flex-col gap-2">
        {/* <Button className="w-full font-semibold" variant="secondary" size="lg" onClick={onViewExamples}>
        <HugeiconsIcon icon={CodeXmlIcon} size={20}/>
          View Examples
        </Button> */}
        <Button
          size="lg"
          onClick={onCopyCode}
          className="w-full font-semibold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 11V9C7 5.70017 7 4.05025 8.02513 3.02513C9.05025 2 10.7002 2 14 2C17.2998 2 18.9497 2 19.9749 3.02513C21 4.05025 21 5.70017 21 9V11C21 14.2998 21 15.9497 19.9749 16.9749C18.9497 18 17.2998 18 14 18C10.7002 18 9.05025 18 8.02513 16.9749C7 15.9497 7 14.2998 7 11Z" />
            <path d="M3 6V15C3 18.2998 3 19.9497 4.02513 20.9749C5.05025 22 6.70017 22 10 22H17" />
          </svg>
          Copy Code
        </Button>
      </div>
    </aside>
  );
}
