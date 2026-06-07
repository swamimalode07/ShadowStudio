import type { Preset } from "./types";

export const PRESETS: Preset[] = [
  {
    name: "Soft",
    shadowType: "box-shadow",
    config: {
      blurMultiplier: 1.5,
      spreadMultiplier: 0.3,
      distanceMultiplier: 0.5,
      opacityMultiplier: 0.3,
    },
    lights: [
      { id: "light-1", x: 300, y: 100, color: "#000000", intensity: 0.7 },
    ],
  },
  {
    name: "Hard",
    shadowType: "box-shadow",
    config: {
      blurMultiplier: 0.2,
      spreadMultiplier: 0.1,
      distanceMultiplier: 1.5,
      opacityMultiplier: 0.8,
    },
    lights: [
      { id: "light-1", x: 250, y: 80, color: "#000000", intensity: 1.0 },
    ],
  },
  {
    name: "Elevated",
    shadowType: "box-shadow",
    config: {
      blurMultiplier: 1.0,
      spreadMultiplier: 0.5,
      distanceMultiplier: 1.0,
      opacityMultiplier: 0.4,
    },
    lights: [
      { id: "light-1", x: 300, y: 50, color: "#000000", intensity: 0.6 },
    ],
  },
  {
    name: "Neon",
    shadowType: "box-shadow",
    config: {
      blurMultiplier: 2.0,
      spreadMultiplier: 1.0,
      distanceMultiplier: 0.3,
      opacityMultiplier: 0.9,
    },
    lights: [
      { id: "light-1", x: 200, y: 150, color: "#06b6d4", intensity: 1.0 },
      { id: "light-2", x: 400, y: 250, color: "#a855f7", intensity: 0.8 },
    ],
  },
  {
    name: "Dramatic",
    shadowType: "box-shadow",
    config: {
      blurMultiplier: 0.8,
      spreadMultiplier: 0.2,
      distanceMultiplier: 2.0,
      opacityMultiplier: 0.7,
    },
    lights: [
      { id: "light-1", x: 100, y: 80, color: "#000000", intensity: 1.0 },
    ],
  },
];
