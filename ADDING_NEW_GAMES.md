# Adding New Games to NAMU ARCADE

This document explains the modular architecture of NAMU ARCADE and provides a step-by-step guide for contributing new mini-games without modifying the core portal routing or layout logic.

---

## Architecture Overview

NAMU ARCADE is built around an **Extensible Game Registry** pattern (`src/games/registry.ts`).

Every game in NAMU ARCADE is an isolated module located inside its own subdirectory within `src/games/<game-id>/`. The portal automatically:
1. Discovers and renders game cards in `/` (Home) and `/games` (Library).
2. Provisions a dedicated lazy-loaded route at `/games/<game-id>`.
3. Passes player stats, controls help, and audio services into the game container.
4. Manages unmounting and memory garbage collection when navigating away.

---

## Step-by-Step Guide

### Step 1: Create Game Directory

Create a dedicated folder for your game inside `src/games/`:

```
src/games/<my-game-id>/
├── MyGame.tsx              # Main React entrypoint
├── engine/                 # Pure physics / simulation logic
│   ├── physics.ts
│   └── types.ts
└── components/             # In-game overlays, HUD, modals
```

### Step 2: Implement Your Game Component

Your root component should export a standard React functional component. Ensure:
- The game cleans up all `requestAnimationFrame`, intervals, and audio contexts in `useEffect` cleanup.
- Visual elements are responsive and adapt to mobile touch and desktop viewports.
- In-game audio triggers `soundService` for seamless volume and mute control.

Example (`src/games/quantum-runner/QuantumRunnerGame.tsx`):

```tsx
import React, { useEffect, useRef } from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { soundService } from '../../services/sound';

export const QuantumRunnerGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Setup game loop...
    return () => {
      // Teardown and clean up resources
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      <canvas ref={canvasRef} width={800} height={450} className="w-full rounded-2xl" />
    </div>
  );
};

export default QuantumRunnerGame;
```

### Step 3: Create Vector Thumbnail Artwork

Add an SVG thumbnail in `public/thumbnails/<my-game-id>.svg`.
Recommended dimensions: 600x400 (aspect ratio 3:2 or 16:9) matching the dark neon theme:
- Primary glow: Cyan (`#00F0FF`), Purple (`#A855F7`), or Pink (`#EC4899`).
- Background: Midnight Navy (`#070A14` to `#0F172A`).

### Step 4: Register in `src/games/registry.ts`

Import your component using `React.lazy` and add your entry to `GAMES_REGISTRY`:

```typescript
const QuantumRunnerComponent = lazy(() => import('./quantum-runner/QuantumRunnerGame'));

export const GAMES_REGISTRY: GameInfo[] = [
  // ... existing games
  {
    id: 'quantum-runner',
    name: 'Quantum Runner',
    tagline: 'Shift dimensions to outrun entropy in a neon cyberspace.',
    description: 'A high-speed rhythm runner featuring real-time dimension shifting and procedural obstacle hazards.',
    category: 'Arcade',
    difficulty: 'Medium',
    route: '/games/quantum-runner',
    thumbnail: '/thumbnails/quantum-runner.svg',
    badge: 'New Release',
    status: 'available',
    supportedControls: {
      desktop: ['Space: Jump', 'Shift: Dimension Shift', 'P: Pause'],
      mobile: ['Left Tap: Jump', 'Right Tap: Dimension Shift'],
    },
    component: QuantumRunnerComponent,
    featured: true,
    accentColor: {
      primary: '#00F0FF',
      secondary: '#3B82F6',
      glow: 'rgba(0, 240, 255, 0.4)',
      border: 'rgba(0, 240, 255, 0.6)',
    },
    modes: ['Story Mode', 'Infinite Runner'],
    releaseDate: '2026-11',
    version: '1.0.0',
  },
];
```

### Step 5: (Optional) Add Game Achievements

In `src/types/achievements.ts`, append new achievements with your `gameId`:

```typescript
{
  id: 'quantum-survivor',
  title: 'Dimension Walker',
  description: 'Survive 100 dimension shifts without taking damage.',
  gameId: 'quantum-runner',
  icon: 'Zap',
  badgeColor: '#00F0FF',
  rarity: 'Epic',
}
```

Trigger unlocks from within your game by calling `usePlayerStore.getState().unlockAchievement('quantum-survivor')`.

### Step 6: Test and Verify

Run Vitest to verify registry compatibility and engine rules:

```bash
npm run test
npm run build
```

The game is now automatically visible in the Home Page, Library, and Player Profile!
