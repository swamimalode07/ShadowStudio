"use client";

import { PRESETS } from "./presets";
import type { Preset } from "./types";

interface PresetBarProps {
  onApplyPreset: (preset: Preset) => void;
}

export default function PresetBar({ onApplyPreset }: PresetBarProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-zinc-500 mr-1">Presets</span>
      {PRESETS.map((preset) => (
        <button
          key={preset.name}
          onClick={() => onApplyPreset(preset)}
          className="px-3 py-1 text-xs font-medium rounded-md bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100 transition-colors"
        >
          {preset.name}
        </button>
      ))}
    </div>
  );
}
