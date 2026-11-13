import { lazy } from 'react';
import type { GameInfo } from '../types/game';

const GravityFlipComponent = lazy(() => import('./gravity-flip/GravityFlipGame'));
const LaserLabComponent = lazy(() => import('./laser-lab/LaserLabGame'));

export const GAMES_REGISTRY: GameInfo[] = [
  {
    id: 'gravity-flip',
    name: 'Gravity Flip',
    tagline: 'Invert gravity. Dodge spikes. Survive the neon runner.',
    description: 'A high-speed rhythm arcade runner where gravity is your only weapon. Invert your trajectory between floor and ceiling in a neon-drenched tunnel while avoiding laser gates and spikes.',
    category: 'Arcade',
    difficulty: 'Medium',
    route: '/games/gravity-flip',
    thumbnail: '/thumbnails/gravity-flip.svg',
    badge: 'High Octane',
    status: 'available',
    supportedControls: {
      desktop: ['Space / Left Click: Invert Gravity', 'P: Pause / Resume', 'R: Restart'],
      mobile: ['Tap Screen: Invert Gravity', 'Dedicated Touch Pause & Restart Buttons'],
    },
    component: GravityFlipComponent,
    featured: true,
    accentColor: {
      primary: '#00F0FF',
      secondary: '#3B82F6',
      glow: 'rgba(0, 240, 255, 0.4)',
      border: 'rgba(0, 240, 255, 0.6)',
    },
    modes: ['Classic Mode (3 Levels)', 'Endless Runner'],
    releaseDate: '2026-11',
    version: '1.0.0',
  },
  {
    id: 'laser-lab',
    name: 'Laser Lab',
    tagline: 'Rotate mirrors. Split beams. Illuminate the quantum matrix.',
    description: 'An elegant optics puzzle challenge. Rotate precision angled mirrors, deflect prismatic beams through barrier mazes, and illuminate all quantum sensors to unlock next-level challenges.',
    category: 'Puzzle',
    difficulty: 'Hard',
    route: '/games/laser-lab',
    thumbnail: '/thumbnails/laser-lab.svg',
    badge: '15 Levels',
    status: 'available',
    supportedControls: {
      desktop: ['Click Mirror: Rotate 90°', 'Z / Ctrl+Z: Undo', 'R: Reset Level'],
      mobile: ['Tap Mirror: Rotate 90°', 'Touch On-Screen Undo / Reset Buttons'],
    },
    component: LaserLabComponent,
    featured: true,
    accentColor: {
      primary: '#A855F7',
      secondary: '#EC4899',
      glow: 'rgba(168, 85, 247, 0.4)',
      border: 'rgba(168, 85, 247, 0.6)',
    },
    modes: ['Beginner (5 Levels)', 'Intermediate (5 Levels)', 'Advanced (5 Levels)'],
    releaseDate: '2026-11',
    version: '1.0.0',
  },
];

export function getGameById(id: string): GameInfo | undefined {
  return GAMES_REGISTRY.find((game) => game.id === id);
}

export function getFeaturedGames(): GameInfo[] {
  return GAMES_REGISTRY.filter((game) => game.featured && game.status === 'available');
}

export function getAllGames(): GameInfo[] {
  return [...GAMES_REGISTRY];
}

export function registerGame(game: GameInfo): void {
  const existingIndex = GAMES_REGISTRY.findIndex((g) => g.id === game.id);
  if (existingIndex >= 0) {
    GAMES_REGISTRY[existingIndex] = game;
  } else {
    GAMES_REGISTRY.push(game);
  }
}
