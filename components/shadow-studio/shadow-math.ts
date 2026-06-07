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
  };
}

export function generateCSSValue(
  shadows: ComputedShadow[],
  shadowType: ShadowType
): string {
  if (shadows.length === 0) return "none";

  switch (shadowType) {
    case "box-shadow":
      return shadows
        .map(
          (s) =>
            `${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.spread}px ${s.color}`
        )
        .join(",\n    ");

    case "text-shadow":
      return shadows
        .map(
          (s) => `${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.color}`
        )
        .join(",\n    ");

    case "drop-shadow":
      return shadows
        .map(
          (s) =>
            `drop-shadow(${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.color})`
        )
        .join("\n    ");

    case "inset":
      return shadows
        .map(
          (s) =>
            `inset ${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.spread}px ${s.color}`
        )
        .join(",\n    ");
  }
}

export function generateFullCSS(
  shadows: ComputedShadow[],
  shadowType: ShadowType
): string {
  const value = generateCSSValue(shadows, shadowType);
  switch (shadowType) {
    case "box-shadow":
      return `box-shadow:\n    ${value};`;
    case "text-shadow":
      return `text-shadow:\n    ${value};`;
    case "drop-shadow":
      return `filter:\n    ${value};`;
    case "inset":
      return `box-shadow:\n    ${value};`;
  }
}

function cssPropName(shadowType: ShadowType): string {
  switch (shadowType) {
    case "box-shadow":
    case "inset":
      return "boxShadow";
    case "text-shadow":
      return "textShadow";
    case "drop-shadow":
      return "filter";
  }
}

export function generateReactStyle(
  shadows: ComputedShadow[],
  shadowType: ShadowType
): string {
  const value = generateCSSValue(shadows, shadowType);
  const prop = cssPropName(shadowType);
  return `{ ${prop}: "${value}" }`;
}

export function generateTailwind(
  shadows: ComputedShadow[],
  shadowType: ShadowType
): string {
  const value = generateCSSValue(shadows, shadowType);
  switch (shadowType) {
    case "box-shadow":
    case "inset":
      return `shadow-[${value.replace(/\s+/g, "_")}]`;
    case "text-shadow":
      return `[text-shadow:${value.replace(/\s+/g, "_")}]`;
    case "drop-shadow":
      return `[filter:${value.replace(/\s+/g, "_")}]`;
  }
}

export function generateCSSVariable(
  shadows: ComputedShadow[],
  shadowType: ShadowType
): string {
  const value = generateCSSValue(shadows, shadowType);
  switch (shadowType) {
    case "box-shadow":
    case "inset":
      return `--shadow: ${value};`;
    case "text-shadow":
      return `--text-shadow: ${value};`;
    case "drop-shadow":
      return `--drop-shadow: ${value};`;
  }
}
