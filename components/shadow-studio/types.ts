export type ShadowType = "box-shadow" | "drop-shadow" | "text-shadow" | "inset";

export interface Light {
  id: string;
  x: number;
  y: number;
  color: string;
  intensity: number;
  config: ShadowConfig;
}

export interface ShadowConfig {
  blurMultiplier: number;
  spreadMultiplier: number;
  distanceMultiplier: number;
  opacityMultiplier: number;
}

export interface ComputedShadow {
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
}

export interface Preset {
  name: string;
  lights: Light[];
  config: ShadowConfig;
  shadowType: ShadowType;
}

export const DEFAULT_CONFIG: ShadowConfig = {
  blurMultiplier: 0,
  spreadMultiplier: 0.5,
  distanceMultiplier: 1.0,
  opacityMultiplier: 0.5,
};

export const DEFAULT_LIGHT: Light = {
  id: "light-1",
  x: 200,
  y: 100,
  color: "#000000",
  intensity: 0.8,
  config: { ...DEFAULT_CONFIG },
};

export const LIGHT_COLORS = [
  "#000000",
  "#1e40af",
  "#7c3aed",
  "#dc2626",
  "#059669",
];

export const MAX_LIGHTS = 5;
