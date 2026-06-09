"use client";

import { useState, useCallback, useEffect, useRef, useLayoutEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";

export interface ExampleItem {
  name: string;
  description: string;
  image: string;
  shadow: string;
}

type FormatKey = "css" | "react" | "tailwind" | "variable";

const FORMATS: { key: FormatKey; label: string }[] = [
  { key: "css", label: "CSS" },
  { key: "react", label: "React" },
  { key: "tailwind", label: "Tailwind" },
  { key: "variable", label: "CSS Var" },
];

function generateFormats(shadow: string): Record<FormatKey, string> {
  const tailwindValue = shadow.replace(/\s+/g, "_");

  return {
    css: `box-shadow: ${shadow};`,
    react: `style={{ boxShadow: "${shadow}" }}`,
    tailwind: `shadow-[${tailwindValue}]`,
    variable: `--shadow: ${shadow};\nbox-shadow: var(--shadow);`,
  };
}

/**
 * Add your examples here.
 * - `image`:  path relative to /public (e.g. "/examples/soft-elevation.png")
 * - `shadow`: raw box-shadow value — all 4 copy formats are derived from it
 */
export const EXAMPLES: ExampleItem[] = [
  {
    name: "Soft Elevation",
    description: "Clean, subtle lift for cards",
    image: "/examples/soft-elevation.png",
    shadow: "0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)",
  },
  {
    name: "Material Raised",
    description: "Bold card elevation",
    image: "/examples/material-raised.png",
    shadow: "0 10px 25px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.08)",
  },
  {
    name: "Dreamy Glow",
    description: "Soft colored ambient glow",
    image: "/examples/dreamy-glow.png",
    shadow: "0 0 40px 4px rgba(99,102,241,0.15), 0 0 80px 8px rgba(99,102,241,0.08)",
  },
  {
    name: "Layered Depth",
    description: "Multi-layer realistic shadow",
    image: "/examples/layered-depth.png",
    shadow: "0 1px 2px rgba(0,0,0,0.06), 0 4px 8px rgba(0,0,0,0.06), 0 16px 32px rgba(0,0,0,0.08)",
  },
  {
    name: "Inset Pressed",
    description: "Pressed-in surface effect",
    image: "/examples/inset-pressed.png",
    shadow: "inset 0 2px 6px rgba(0,0,0,0.15), inset 0 1px 3px rgba(0,0,0,0.1)",
  },
  {
    name: "Neon Edge",
    description: "Vivid glowing border feel",
    image: "/examples/neon-edge.png",
    shadow: "0 0 10px rgba(168,85,247,0.4), 0 0 30px rgba(168,85,247,0.15), 0 0 60px rgba(168,85,247,0.08)",
  },
  {
    name: "Sharp Bottom",
    description: "Hard directional shadow",
    image: "/examples/sharp-bottom.png",
    shadow: "0 8px 0 -2px rgba(0,0,0,0.12)",
  },
  {
    name: "Double Tone",
    description: "Two-color dual shadow",
    image: "/examples/double-tone.png",
    shadow: "8px 8px 24px rgba(99,102,241,0.12), -8px -8px 24px rgba(244,63,94,0.08)",
  },
  {
    name: "Neumorphic",
    description: "Soft embossed surface",
    image: "/examples/neumorphic.png",
    shadow: "8px 8px 16px rgba(0,0,0,0.08), -8px -8px 16px rgba(255,255,255,0.6)",
  },
];

interface ExampleProps {
  open: boolean;
  onClose: () => void;
}

function ExampleCard({ item }: { item: ExampleItem }) {
  const [activeFormat, setActiveFormat] = useState<FormatKey>("css");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const formats = generateFormats(item.shadow);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const container = tabsRef.current;
    if (!container) return;
    const idx = FORMATS.findIndex((f) => f.key === activeFormat);
    const btn = container.children[idx + 1] as HTMLElement | undefined;
    if (!btn) return;
    setPill({ left: btn.offsetLeft, width: btn.offsetWidth });
  }, [activeFormat]);

  const handleCopy = useCallback(async (key: FormatKey) => {
    try {
      await navigator.clipboard.writeText(formats[key]);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    } catch {
      /* noop */
    }
  }, [formats]);

  return (
    <div className="bg-card border-none rounded-xl overflow-hidden flex flex-col transition-colors hover:border-muted-foreground/30">
      {/* Image preview */}
      <div className="relative w-full aspect-video bg-background">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Title */}
        <div>
          <p className="text-sm font-semibold text-foreground">{item.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {item.description}
          </p>
        </div>

        {/* Format tabs with sliding pill */}
        <div ref={tabsRef} className="relative flex gap-1 bg-muted/50 rounded-lg p-1">
          <div
            className="absolute top-1 bottom-1 rounded-md bg-background shadow-sm transition-all duration-300 ease-out"
            style={{ left: pill.left, width: pill.width }}
          />
          {FORMATS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveFormat(key)}
              className={`relative z-10 flex-1 text-[11px] font-medium py-1.5 rounded-md transition-colors duration-200 ${
                activeFormat === key
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Code block */}
        <pre className="bg-muted/50 rounded-lg px-3 py-2.5 text-[11px] font-mono text-muted-foreground overflow-x-auto whitespace-pre-wrap break-all leading-relaxed flex-1 min-h-[60px]">
          <code>{formats[activeFormat]}</code>
        </pre>

        {/* Copy button */}
        <Button
          variant={copiedKey === activeFormat ? "default" : "secondary"}
          size="sm"
          className="w-full font-semibold"
          onClick={() => handleCopy(activeFormat)}
        >
          {copiedKey === activeFormat ? (
            "Copied!"
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1.5"
              >
                <path d="M7 11V9C7 5.70017 7 4.05025 8.02513 3.02513C9.05025 2 10.7002 2 14 2C17.2998 2 18.9497 2 19.9749 3.02513C21 4.05025 21 5.70017 21 9V11C21 14.2998 21 15.9497 19.9749 16.9749C18.9497 18 17.2998 18 14 18C10.7002 18 9.05025 18 8.02513 16.9749C7 15.9497 7 14.2998 7 11Z" />
                <path d="M3 6V15C3 18.2998 3 19.9497 4.02513 20.9749C5.05025 22 6.70017 22 10 22H17" />
              </svg>
              Copy {FORMATS.find((f) => f.key === activeFormat)!.label}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default function Example({ open, onClose }: ExampleProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [open]);

  const handleTransitionEnd = useCallback(() => {
    if (!visible) onClose();
  }, [visible, onClose]);

  const handleBackdropClick = useCallback(() => {
    setVisible(false);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-background/60 backdrop-blur-xs transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleBackdropClick}
      />

      {/* Sheet — 80% of the viewport */}
      <div
        className={`relative w-[80vw] h-[92vh] bg-muted rounded-t-2xl flex flex-col transition-transform duration-300 ease-out ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
        onTransitionEnd={handleTransitionEnd}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 shrink-0 pt-4">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              Shadow Examples
            </h2>
            <p className="text-sm text-neutral-400 mt-0.5">
              Pre-made styles — pick a format and copy the code
            </p>
          </div>
          <Button variant="ghost" size="lg" onClick={handleBackdropClick}>
            <HugeiconsIcon icon={Cancel01Icon} size={20} />
          </Button>
        </div>

        {/* Scrollable grid */}
        <div className="flex-1 overflow-y-auto scrollbar-none px-6 pb-8">
          <div className="grid grid-cols-3 gap-5">
            {EXAMPLES.map((item) => (
              <ExampleCard key={item.name} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
