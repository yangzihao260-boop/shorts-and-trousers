export type GameMode = 'trousers' | 'shorts';

export type SpeedLevel = 'slow' | 'medium' | 'fast';

export type PantsType = 'trousers' | 'shorts';

export type PantsMaterial =
  | 'denim'        // Classic blue jeans
  | 'khaki'        // Beige/camel chinos
  | 'plaid'        // Tartan / checkered
  | 'sport'        // Neon side stripes
  | 'polka'        // Playful polka dots
  | 'stripes'      // Vertical summer stripes
  | 'floral'       // Tropical beach pattern
  | 'camo'         // Green adventure camo
  | 'sweatpants'   // Cozy heather grey fleece
  | 'velvet';      // Ruby red / emerald

export interface PantsVariant {
  id: string;
  type: PantsType;
  material: PantsMaterial;
  name: string;
  chineseName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  patternType: string;
}

export interface FallingPantsItem {
  id: string;
  type: PantsType;
  material: PantsMaterial;
  variant: PantsVariant;
  x: number; // percentage from left (5% to 85%)
  y: number; // current pixel position from top
  speed: number; // pixels per second
  scale: number; // 0.85 to 1.25
  rotation: number; // initial tilt (-15 to 15 deg)
  swayAmp: number; // sway amplitude in pixels
  swayFreq: number; // sway speed
  swayOffset: number;
  isCollected: boolean;
  collectedAt?: number;
}

export interface FloatingFeedback {
  id: string;
  x: number;
  y: number;
  text: string;
  subText: string;
  type: PantsType;
  points: number;
}

export interface GameStats {
  score: number;
  streak: number;
  bestStreak: number;
  trousersCaught: number;
  shortsCaught: number;
  totalAttempts: number;
}
