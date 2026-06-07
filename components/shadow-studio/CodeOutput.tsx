"use client";

import { useState, useCallback, useRef } from "react";

interface CodeOutputProps {
  cssString: string;
}

export default function CodeOutput({ cssString }: CodeOutputProps) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(cssString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      if (codeRef.current && selection) {
        range.selectNodeContents(codeRef.current);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }, [cssString]);

  return (
    <div className="flex items-start gap-4">
      <pre
        ref={codeRef}
        className="flex-1 text-sm font-mono text-zinc-300 bg-zinc-900 rounded-lg p-4 overflow-x-auto"
      >
        <code>{cssString}</code>
      </pre>
      <button
        onClick={handleCopy}
        className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          copied
            ? "bg-green-600 text-white"
            : "bg-zinc-700 text-zinc-200 hover:bg-zinc-600"
        }`}
      >
        {copied ? "Copied!" : "Copy CSS"}
      </button>
    </div>
  );
}
