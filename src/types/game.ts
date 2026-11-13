import type { ComponentType, LazyExoticComponent } from 'react';

export type GameCategory = 'Arcade' | 'Puzzle' | 'Action' | 'Strategy';
export type GameDifficulty = 'Easy' | 'Medium' | 'Hard';
export type GameStatus = 'available' | 'coming_soon' | 'beta';

export interface GameControls {
  desktop: string[];
  mobile: string[];
}

export interface GameAccentColor {
  primary: string;
  secondary: string;
  glow: string;
  border: string;
}

export interface GameInfo {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: GameCategory;
  difficulty: GameDifficulty;
  route: string;
  thumbnail: string;
  badge?: string;
  status: GameStatus;
  supportedControls: GameControls;
  component: LazyExoticComponent<ComponentType>;
  featured: boolean;
  accentColor: GameAccentColor;
  modes?: string[];
  releaseDate: string;
  version: string;
}
