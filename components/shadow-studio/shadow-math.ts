import type { Light, ComputedShadow, ShadowType } from "./types";

export function computeShadow(
  light: Light,
  cardCenter: { x: number; y: number },
): ComputedShadow {
  const { config } = light;
  const dx = light.x - cardCenter.x;
  const dy = light.y - cardCenter.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const safeDistance = Math.max(distance, 1);

  const minOffset = 2;
  const offsetScale = (minOffset + distance / 5) * config.distanceMultiplier;
  const offsetX = -(dx / safeDistance) * offsetScale;
  const offsetY = -(dy / safeDistance) * offsetScale;

  const normalizedDistance = Math.min(distance / 300, 1);
  const blur = config.blurMultiplier * 30;

  const spread =
    Math.max(2, 20 - normalizedDistance * 18) * config.spreadMultiplier;

  const baseOpacity =
    (0.3 + normalizedDistance * 0.7) *
    config.opacityMultiplier *
    light.intensity;
  const opacity = Math.max(0.1, Math.min(1, baseOpacity));

  const r = parseInt(light.color.slice(1, 3), 16);
  const g = parseInt(light.color.slice(3, 5), 16);
  const b = parseInt(light.color.slice(5, 7), 16);
  const color = `rgba(${r}, ${g}, ${b}, ${opacity.toFixed(2)})`;

  return {
    offsetX: Math.round(offsetX),
    offsetY: Math.round(offsetY),
    blur: Math.round(Math.max(0, blur)),
    spread: Math.round(Math.max(0, spread)),
    color,
    shadowType: light.shadowType,
  };
}

function groupByType(shadows: ComputedShadow[]) {
  const boxShadows: ComputedShadow[] = [];
  const insetShadows: ComputedShadow[] = [];
  const textShadows: ComputedShadow[] = [];
  const dropShadows: ComputedShadow[] = [];
  for (const s of shadows) {
    switch (s.shadowType) {
      case "box-shadow": boxShadows.push(s); break;
      case "inset": insetShadows.push(s); break;
      case "text-shadow": textShadows.push(s); break;
      case "drop-shadow": dropShadows.push(s); break;
    }
  }
  return { boxShadows, insetShadows, textShadows, dropShadows };
}

function formatShadow(s: ComputedShadow): string {
  switch (s.shadowType) {
    case "box-shadow":
      return `${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.spread}px ${s.color}`;
    case "inset":
      return `inset ${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.spread}px ${s.color}`;
    case "text-shadow":
      return `${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.color}`;
    case "drop-shadow":
      return `drop-shadow(${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.color})`;
  }
}

export function generateCSSValue(
  shadows: ComputedShadow[],
  shadowType: ShadowType
): string {
  if (shadows.length === 0) return "none";
  const filtered = shadows.filter((s) => s.shadowType === shadowType);
  if (filtered.length === 0) return "none";

  if (shadowType === "drop-shadow") {
    return filtered.map(formatShadow).join("\n    ");
  }
  return filtered.map(formatShadow).join(",\n    ");
}

export function generateMixedBoxShadow(shadows: ComputedShadow[]): string {
  const { boxShadows, insetShadows } = groupByType(shadows);
  const all = [...boxShadows, ...insetShadows];
  if (all.length === 0) return "none";
  return all.map(formatShadow).join(",\n    ");
}

export function buildMixedStyle(shadows: ComputedShadow[]): React.CSSProperties {
  const { boxShadows, insetShadows, textShadows, dropShadows } = groupByType(shadows);
  const style: React.CSSProperties = {};

  const boxAll = [...boxShadows, ...insetShadows];
  if (boxAll.length > 0) {
    style.boxShadow = boxAll.map(formatShadow).join(", ");
  }
  if (textShadows.length > 0) {
    style.textShadow = textShadows.map(formatShadow).join(", ");
  }
  if (dropShadows.length > 0) {
    style.filter = dropShadows.map(formatShadow).join(" ");
  }
  return style;
}

export function generateFullCSS(
  shadows: ComputedShadow[],
): string {
  const { boxShadows, insetShadows, textShadows, dropShadows } = groupByType(shadows);
  const lines: string[] = [];

  const boxAll = [...boxShadows, ...insetShadows];
  if (boxAll.length > 0) {
    lines.push(`box-shadow:\n    ${boxAll.map(formatShadow).join(",\n    ")};`);
  }
  if (textShadows.length > 0) {
    lines.push(`text-shadow:\n    ${textShadows.map(formatShadow).join(",\n    ")};`);
  }
  if (dropShadows.length > 0) {
    lines.push(`filter:\n    ${dropShadows.map(formatShadow).join("\n    ")};`);
  }
  return lines.join("\n") || "none";
}

export function generateReactStyle(
  shadows: ComputedShadow[],
): string {
  const { boxShadows, insetShadows, textShadows, dropShadows } = groupByType(shadows);
  const props: string[] = [];

  const boxAll = [...boxShadows, ...insetShadows];
  if (boxAll.length > 0) {
    props.push(`boxShadow: "${boxAll.map(formatShadow).join(", ")}"`);
  }
  if (textShadows.length > 0) {
    props.push(`textShadow: "${textShadows.map(formatShadow).join(", ")}"`);
  }
  if (dropShadows.length > 0) {
    props.push(`filter: "${dropShadows.map(formatShadow).join(" ")}"`);
  }
  return `{ ${props.join(", ")} }`;
}

export function generateTailwind(
  shadows: ComputedShadow[],
): string {
  const { boxShadows, insetShadows, textShadows, dropShadows } = groupByType(shadows);
  const classes: string[] = [];

  const boxAll = [...boxShadows, ...insetShadows];
  if (boxAll.length > 0) {
    classes.push(`shadow-[${boxAll.map(formatShadow).join(",").replace(/\s+/g, "_")}]`);
  }
  if (textShadows.length > 0) {
    classes.push(`[text-shadow:${textShadows.map(formatShadow).join(",").replace(/\s+/g, "_")}]`);
  }
  if (dropShadows.length > 0) {
    classes.push(`[filter:${dropShadows.map(formatShadow).join("_").replace(/\s+/g, "_")}]`);
  }
  return classes.join(" ");
}

export function generateCSSVariable(
  shadows: ComputedShadow[],
): string {
  const { boxShadows, insetShadows, textShadows, dropShadows } = groupByType(shadows);
  const lines: string[] = [];

  const boxAll = [...boxShadows, ...insetShadows];
  if (boxAll.length > 0) {
    lines.push(`--shadow: ${boxAll.map(formatShadow).join(", ")};`);
  }
  if (textShadows.length > 0) {
    lines.push(`--text-shadow: ${textShadows.map(formatShadow).join(", ")};`);
  }
  if (dropShadows.length > 0) {
    lines.push(`--drop-shadow: ${dropShadows.map(formatShadow).join(" ")};`);
  }
  return lines.join("\n") || "none";
}
