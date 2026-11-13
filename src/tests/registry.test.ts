import { describe, it, expect } from 'vitest';
import { GAMES_REGISTRY, getGameById, getFeaturedGames, registerGame } from '../games/registry';
import { lazy } from 'react';
import type { GameInfo } from '../types/game';

describe('Game Registry Extensibility', () => {
  it('contains exactly two official launch games in V1.0', () => {
    expect(GAMES_REGISTRY.length).toBe(2);
    const ids = GAMES_REGISTRY.map((g) => g.id);
    expect(ids).toContain('gravity-flip');
    expect(ids).toContain('laser-lab');
  });

  it('retrieves games by ID with complete metadata', () => {
    const gf = getGameById('gravity-flip');
    expect(gf).toBeDefined();
    expect(gf?.name).toBe('Gravity Flip');
    expect(gf?.category).toBe('Arcade');
    expect(gf?.supportedControls.desktop.length).toBeGreaterThan(0);
    expect(gf?.supportedControls.mobile.length).toBeGreaterThan(0);

    const ll = getGameById('laser-lab');
    expect(ll).toBeDefined();
    expect(ll?.name).toBe('Laser Lab');
    expect(ll?.category).toBe('Puzzle');
  });

  it('returns featured games correctly', () => {
    const featured = getFeaturedGames();
    expect(featured.length).toBe(2);
  });

  it('allows registering a third new game without rewriting registry', () => {
    const DummyComponent = lazy(() => Promise.resolve({ default: () => null }));
    const mockGame: GameInfo = {
      id: 'quantum-runner',
      name: 'Quantum Runner',
      tagline: 'Future title',
      description: 'Extensibility test game',
      category: 'Action',
      difficulty: 'Easy',
      route: '/games/quantum-runner',
      thumbnail: '/thumbnails/quantum.svg',
      status: 'coming_soon',
      supportedControls: { desktop: ['Space'], mobile: ['Tap'] },
      component: DummyComponent,
      featured: false,
      accentColor: { primary: '#FFF', secondary: '#000', glow: 'rgba(0,0,0,0.1)', border: '#FFF' },
      releaseDate: '2027-01',
      version: '1.0.0',
    };

    registerGame(mockGame);
    expect(getGameById('quantum-runner')).toBeDefined();
  });
});
