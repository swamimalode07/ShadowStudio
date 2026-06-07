"use client";

import { useState, useCallback, useEffect } from "react";
import type { ComputedShadow, ShadowType } from "./types";
import {
  generateFullCSS,
  generateReactStyle,
  generateTailwind,
  generateCSSVariable,
} from "./shadow-math";

interface CodeOutputProps {
  shadows: ComputedShadow[];
  shadowType: ShadowType;
  open: boolean;
  onClose: () => void;
}

const FORMATS = [
  { key: "css", label: "CSS", gen: generateFullCSS },
  { key: "react", label: "React", gen: generateReactStyle },
  { key: "tailwind", label: "Tailwind", gen: generateTailwind },
  { key: "variable", label: "CSS Variable", gen: generateCSSVariable },
] as const;

export default function CodeOutput({ shadows, shadowType, open, onClose }: CodeOutputProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [open]);

  const handleCopy = useCallback(async (key: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    } catch {
      /* noop */
    }
  }, []);

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

      {/* Sheet */}
      <div
        className={`relative w-full max-w-2xl bg-secondary  rounded-t-2xl  transition-transform duration-300 ease-out ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
        onTransitionEnd={handleTransitionEnd}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3">
          <h2 className="text-sm font-semibold text-foreground">Copy Code</h2>
          <button
            onClick={handleBackdropClick}
            className="text-muted-foreground hover:text-foreground transition-colors text-lg leading-none"
          >
            &times;
          </button>
        </div>

        {/* Format cards */}
        <div className="px-6 pb-8 flex flex-col gap-3">
          {FORMATS.map(({ key, label, gen }) => {
            const code = gen(shadows, shadowType);
            const isCopied = copiedKey === key;
            return (
              <div
                key={key}
                className="bg-card border border-border rounded-xl overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {label}
                  </span>
                  <button
                    onClick={() => handleCopy(key, code)}
                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                      isCopied
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted-foreground/10 hover:text-foreground"
                    }`}
                  >
                    {isCopied ? "Copied!" : "Copy"}
                  </button>
                </div>
                      <pre className="px-4 py-3 text-xs font-mono text-muted-foreground overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
                  <code>{code}</code>
                </pre>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
