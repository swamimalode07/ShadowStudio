"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";

const SHADES = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] as const;

const TAILWIND_COLORS: { name: string; shades: Record<string, string> }[] = [
  {
    name: "slate",
    shades: { "50": "#f8fafc", "100": "#f1f5f9", "200": "#e2e8f0", "300": "#cbd5e1", "400": "#94a3b8", "500": "#64748b", "600": "#475569", "700": "#334155", "800": "#1e293b", "900": "#0f172a", "950": "#020617" },
  },
  {
    name: "gray",
    shades: { "50": "#f9fafb", "100": "#f3f4f6", "200": "#e5e7eb", "300": "#d1d5db", "400": "#9ca3af", "500": "#6b7280", "600": "#4b5563", "700": "#374151", "800": "#1f2937", "900": "#111827", "950": "#030712" },
  },
  {
    name: "zinc",
    shades: { "50": "#fafafa", "100": "#f4f4f5", "200": "#e4e4e7", "300": "#d4d4d8", "400": "#a1a1aa", "500": "#71717a", "600": "#52525b", "700": "#3f3f46", "800": "#27272a", "900": "#18181b", "950": "#09090b" },
  },
  {
    name: "neutral",
    shades: { "50": "#fafafa", "100": "#f5f5f5", "200": "#e5e5e5", "300": "#d4d4d4", "400": "#a3a3a3", "500": "#737373", "600": "#525252", "700": "#404040", "800": "#262626", "900": "#171717", "950": "#0a0a0a" },
  },
  {
    name: "stone",
    shades: { "50": "#fafaf9", "100": "#f5f5f4", "200": "#e7e5e4", "300": "#d6d3d1", "400": "#a8a29e", "500": "#78716c", "600": "#57534e", "700": "#44403c", "800": "#292524", "900": "#1c1917", "950": "#0c0a09" },
  },
  {
    name: "red",
    shades: { "50": "#fef2f2", "100": "#fee2e2", "200": "#fecaca", "300": "#fca5a5", "400": "#f87171", "500": "#ef4444", "600": "#dc2626", "700": "#b91c1c", "800": "#991b1b", "900": "#7f1d1d", "950": "#450a0a" },
  },
  {
    name: "orange",
    shades: { "50": "#fff7ed", "100": "#ffedd5", "200": "#fed7aa", "300": "#fdba74", "400": "#fb923c", "500": "#f97316", "600": "#ea580c", "700": "#c2410c", "800": "#9a3412", "900": "#7c2d12", "950": "#431407" },
  },
  {
    name: "amber",
    shades: { "50": "#fffbeb", "100": "#fef3c7", "200": "#fde68a", "300": "#fcd34d", "400": "#fbbf24", "500": "#f59e0b", "600": "#d97706", "700": "#b45309", "800": "#92400e", "900": "#78350f", "950": "#451a03" },
  },
  {
    name: "yellow",
    shades: { "50": "#fefce8", "100": "#fef9c3", "200": "#fef08a", "300": "#fde047", "400": "#facc15", "500": "#eab308", "600": "#ca8a04", "700": "#a16207", "800": "#854d0e", "900": "#713f12", "950": "#422006" },
  },
  {
    name: "lime",
    shades: { "50": "#f7fee7", "100": "#ecfccb", "200": "#d9f99d", "300": "#bef264", "400": "#a3e635", "500": "#84cc16", "600": "#65a30d", "700": "#4d7c0f", "800": "#3f6212", "900": "#365314", "950": "#1a2e05" },
  },
  {
    name: "green",
    shades: { "50": "#f0fdf4", "100": "#dcfce7", "200": "#bbf7d0", "300": "#86efac", "400": "#4ade80", "500": "#22c55e", "600": "#16a34a", "700": "#15803d", "800": "#166534", "900": "#14532d", "950": "#052e16" },
  },
  {
    name: "emerald",
    shades: { "50": "#ecfdf5", "100": "#d1fae5", "200": "#a7f3d0", "300": "#6ee7b7", "400": "#34d399", "500": "#10b981", "600": "#059669", "700": "#047857", "800": "#065f46", "900": "#064e3b", "950": "#022c22" },
  },
  {
    name: "teal",
    shades: { "50": "#f0fdfa", "100": "#ccfbf1", "200": "#99f6e4", "300": "#5eead4", "400": "#2dd4bf", "500": "#14b8a6", "600": "#0d9488", "700": "#0f766e", "800": "#115e59", "900": "#134e4a", "950": "#042f2e" },
  },
  {
    name: "cyan",
    shades: { "50": "#ecfeff", "100": "#cffafe", "200": "#a5f3fc", "300": "#67e8f9", "400": "#22d3ee", "500": "#06b6d4", "600": "#0891b2", "700": "#0e7490", "800": "#155e75", "900": "#164e63", "950": "#083344" },
  },
  {
    name: "sky",
    shades: { "50": "#f0f9ff", "100": "#e0f2fe", "200": "#bae6fd", "300": "#7dd3fc", "400": "#38bdf8", "500": "#0ea5e9", "600": "#0284c7", "700": "#0369a1", "800": "#075985", "900": "#0c4a6e", "950": "#082f49" },
  },
  {
    name: "blue",
    shades: { "50": "#eff6ff", "100": "#dbeafe", "200": "#bfdbfe", "300": "#93c5fd", "400": "#60a5fa", "500": "#3b82f6", "600": "#2563eb", "700": "#1d4ed8", "800": "#1e40af", "900": "#1e3a8a", "950": "#172554" },
  },
  {
    name: "indigo",
    shades: { "50": "#eef2ff", "100": "#e0e7ff", "200": "#c7d2fe", "300": "#a5b4fc", "400": "#818cf8", "500": "#6366f1", "600": "#4f46e5", "700": "#4338ca", "800": "#3730a3", "900": "#312e81", "950": "#1e1b4b" },
  },
  {
    name: "violet",
    shades: { "50": "#f5f3ff", "100": "#ede9fe", "200": "#ddd6fe", "300": "#c4b5fd", "400": "#a78bfa", "500": "#8b5cf6", "600": "#7c3aed", "700": "#6d28d9", "800": "#5b21b6", "900": "#4c1d95", "950": "#2e1065" },
  },
  {
    name: "purple",
    shades: { "50": "#faf5ff", "100": "#f3e8ff", "200": "#e9d5ff", "300": "#d8b4fe", "400": "#c084fc", "500": "#a855f7", "600": "#9333ea", "700": "#7e22ce", "800": "#6b21a8", "900": "#581c87", "950": "#3b0764" },
  },
  {
    name: "fuchsia",
    shades: { "50": "#fdf4ff", "100": "#fae8ff", "200": "#f5d0fe", "300": "#f0abfc", "400": "#e879f9", "500": "#d946ef", "600": "#c026d3", "700": "#a21caf", "800": "#86198f", "900": "#701a75", "950": "#4a044e" },
  },
  {
    name: "pink",
    shades: { "50": "#fdf2f8", "100": "#fce7f3", "200": "#fbcfe8", "300": "#f9a8d4", "400": "#f472b6", "500": "#ec4899", "600": "#db2777", "700": "#be185d", "800": "#9d174d", "900": "#831843", "950": "#500724" },
  },
  {
    name: "rose",
    shades: { "50": "#fff1f2", "100": "#ffe4e6", "200": "#fecdd3", "300": "#fda4af", "400": "#fb7185", "500": "#f43f5e", "600": "#e11d48", "700": "#be123c", "800": "#9f1239", "900": "#881337", "950": "#4c0519" },
  },
];

function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

interface TailwindColorPickerProps {
  currentColor: string;
  onSelect: (color: string) => void;
}

export default function TailwindColorPicker({ currentColor, onSelect }: TailwindColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [open]);

  const handleTransitionEnd = useCallback(() => {
    if (!visible) setOpen(false);
  }, [visible]);

  const handleBackdropClick = useCallback(() => {
    setVisible(false);
  }, []);

  const handleSelect = useCallback(
    (hex: string) => {
      onSelect(hex);
      setVisible(false);
    },
    [onSelect]
  );

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setVisible(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-8 h-8 rounded-md border border-border cursor-pointer transition-transform hover:scale-105 active:scale-95"
        style={{ backgroundColor: currentColor }}
      />

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className={`absolute inset-0 bg-background/60 backdrop-blur-xs transition-opacity duration-300 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
            onClick={handleBackdropClick}
          />

          <div
            className={`relative w-[820px] max-h-[85vh] bg-secondary rounded-2xl flex flex-col transition-all duration-300 ease-out ${
              visible
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 translate-y-4"
            }`}
            onTransitionEnd={handleTransitionEnd}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-semibold text-foreground">
                  Color Palette
                </h2>
                {hoveredColor && (
                  <span className="text-xs font-mono text-muted-foreground">
                    {hoveredColor}
                  </span>
                )}
              </div>
              <Button variant="ghost" size="lg" onClick={handleBackdropClick}>
                <HugeiconsIcon icon={Cancel01Icon} size={20} />
              </Button>
            </div>

            {/* Color Grid */}
            <div className="overflow-y-auto scrollbar-none px-6 py-4 flex flex-col gap-3">
              {TAILWIND_COLORS.map(({ name, shades }) => (
                <div key={name} className="flex items-center gap-3">
                  <span className="w-16 shrink-0 text-xs font-semibold text-muted-foreground text-right">
                    {name}
                  </span>
                  <div className="flex gap-1 flex-1">
                    {SHADES.map((shade) => {
                      const hex = shades[shade];
                      const isSelected = currentColor.toLowerCase() === hex.toLowerCase();
                      return (
                        <button
                          key={shade}
                          onClick={() => handleSelect(hex)}
                          onMouseEnter={() => setHoveredColor(hex)}
                          onMouseLeave={() => setHoveredColor(null)}
                          className="group relative flex-1"
                          title={`${name}-${shade}: ${hex}`}
                        >
                          <div
                            className={`h-8 rounded-md transition-all duration-150 group-hover:scale-y-125 group-hover:shadow-lg ${
                              isSelected
                                ? "ring-2 ring-primary ring-offset-2 ring-offset-secondary scale-y-125"
                                : ""
                            }`}
                            style={{ backgroundColor: hex }}
                          />
                          <span
                            className={`block text-center text-[9px] mt-1 transition-opacity ${
                              isSelected
                                ? "opacity-100 font-semibold text-foreground"
                                : "opacity-0 group-hover:opacity-100 text-muted-foreground"
                            }`}
                          >
                            {shade}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer with selected color preview */}
            <div className="flex items-center gap-3 px-6 py-3 border-t border-border shrink-0">
              <div
                className="w-6 h-6 rounded-md border border-border"
                style={{ backgroundColor: currentColor }}
              />
              <span className="text-xs font-mono text-muted-foreground">
                Selected: {currentColor}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
