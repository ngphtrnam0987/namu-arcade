import type { LaserLevel } from './types';

export const LASER_LEVELS: LaserLevel[] = [
  // ==========================================
  // BEGINNER (Levels 1 - 5)
  // ==========================================
  {
    id: 1,
    title: 'First Light',
    tier: 'Beginner',
    cols: 5,
    rows: 5,
    threeStarMoves: 1,
    hint: 'Rotate the angled mirror to deflect the cyan beam downward to the sensor.',
    cells: [
      { row: 2, col: 0, type: 'emitter', id: 'e1', direction: 'RIGHT' },
      { row: 2, col: 3, type: 'mirror', id: 'm1', orientation: '/', isRotatable: true },
      { row: 4, col: 3, type: 'target', id: 't1', targetId: 'target-1' },
    ],
    solution: {
      '2,3': '\\',
    },
  },
  {
    id: 2,
    title: 'Corner Bounce',
    tier: 'Beginner',
    cols: 5,
    rows: 5,
    threeStarMoves: 2,
    hint: 'Use two mirrors to create an inverted U-bend around the perimeter.',
    cells: [
      { row: 0, col: 1, type: 'emitter', id: 'e1', direction: 'DOWN' },
      { row: 3, col: 1, type: 'mirror', id: 'm1', orientation: '/', isRotatable: true },
      { row: 3, col: 4, type: 'mirror', id: 'm2', orientation: '\\', isRotatable: true },
      { row: 1, col: 4, type: 'target', id: 't1', targetId: 'target-1' },
      { row: 2, col: 2, type: 'wall', id: 'w1' },
    ],
    solution: {
      '3,1': '\\',
      '3,4': '/',
    },
  },
  {
    id: 3,
    title: 'The Zigzag',
    tier: 'Beginner',
    cols: 5,
    rows: 5,
    threeStarMoves: 2,
    hint: 'Send the beam across the chamber, drop down, and return back west.',
    cells: [
      { row: 1, col: 0, type: 'emitter', id: 'e1', direction: 'RIGHT' },
      { row: 1, col: 4, type: 'mirror', id: 'm1', orientation: '/', isRotatable: true },
      { row: 3, col: 4, type: 'mirror', id: 'm2', orientation: '\\', isRotatable: true },
      { row: 3, col: 0, type: 'target', id: 't1', targetId: 'target-1' },
      { row: 2, col: 1, type: 'wall', id: 'w1' },
      { row: 2, col: 2, type: 'wall', id: 'w2' },
      { row: 2, col: 3, type: 'wall', id: 'w3' },
    ],
    solution: {
      '1,4': '\\',
      '3,4': '/',
    },
  },
  {
    id: 4,
    title: 'Twin Sensors',
    tier: 'Beginner',
    cols: 6,
    rows: 6,
    threeStarMoves: 2,
    hint: 'The beam splitter sends light in two directions at once.',
    cells: [
      { row: 0, col: 2, type: 'emitter', id: 'e1', direction: 'DOWN' },
      { row: 2, col: 2, type: 'splitter', id: 's1', orientation: '/', isRotatable: true },
      { row: 2, col: 5, type: 'target', id: 't1', targetId: 'target-1' },
      { row: 4, col: 2, type: 'mirror', id: 'm1', orientation: '\\', isRotatable: true },
      { row: 4, col: 0, type: 'target', id: 't2', targetId: 'target-2' },
    ],
    solution: {
      // Splitter at (2,2) with orientation:
      // incoming from UP (dr=1, dc=0).
      // We want reflected to go RIGHT to (2,5):
      // With '\', (1,0) reflects to (0,1) -> RIGHT!
      // And transmitted goes straight DOWN to (4,2).
      // At (4,2), incoming from UP (1,0). We want to go LEFT to (4,0):
      // With '/', (1,0) reflects to (0,-1) -> LEFT!
      '2,2': '\\',
      '4,2': '/',
    },
  },
  {
    id: 5,
    title: 'Prism Alley',
    tier: 'Beginner',
    cols: 6,
    rows: 6,
    threeStarMoves: 3,
    hint: 'Navigate the outer perimeter with three precision reflections.',
    cells: [
      { row: 5, col: 1, type: 'emitter', id: 'e1', direction: 'UP' },
      { row: 1, col: 1, type: 'mirror', id: 'm1', orientation: '\\', isRotatable: true },
      { row: 1, col: 4, type: 'mirror', id: 'm2', orientation: '/', isRotatable: true },
      { row: 4, col: 4, type: 'mirror', id: 'm3', orientation: '\\', isRotatable: true },
      { row: 4, col: 2, type: 'target', id: 't1', targetId: 'target-1' },
      { row: 3, col: 2, type: 'wall', id: 'w1' },
      { row: 3, col: 3, type: 'wall', id: 'w2' },
    ],
    solution: {
      // (5,1) UP (-1,0) to (1,1):
      // with '/', reflects to (0,1) -> RIGHT to (1,4).
      // at (1,4) incoming from LEFT (0,1):
      // with '\', reflects to (1,0) -> DOWN to (4,4).
      // at (4,4) incoming from UP (1,0):
      // with '/', reflects to (0,-1) -> LEFT to (4,2) target!
      '1,1': '/',
      '1,4': '\\',
      '4,4': '/',
    },
  },

  // ==========================================
  // INTERMEDIATE (Levels 6 - 10)
  // ==========================================
  {
    id: 6,
    title: 'Perimeter Guard',
    tier: 'Intermediate',
    cols: 6,
    rows: 6,
    threeStarMoves: 3,
    hint: 'Bypass the central security barrier by routing clockwise.',
    cells: [
      { row: 0, col: 0, type: 'emitter', id: 'e1', direction: 'RIGHT' },
      { row: 0, col: 5, type: 'mirror', id: 'm1', orientation: '/', isRotatable: true },
      { row: 5, col: 5, type: 'mirror', id: 'm2', orientation: '\\', isRotatable: true },
      { row: 5, col: 1, type: 'mirror', id: 'm3', orientation: '/', isRotatable: true },
      { row: 2, col: 1, type: 'target', id: 't1', targetId: 'target-1' },
      { row: 2, col: 2, type: 'wall', id: 'w1' },
      { row: 2, col: 3, type: 'wall', id: 'w2' },
      { row: 3, col: 2, type: 'wall', id: 'w3' },
      { row: 3, col: 3, type: 'wall', id: 'w4' },
    ],
    solution: {
      // (0,0) RIGHT (0,1) to (0,5):
      // with '\', reflects DOWN (1,0) to (5,5).
      // at (5,5) incoming from UP (1,0):
      // with '/', reflects LEFT (0,-1) to (5,1).
      // at (5,1) incoming from RIGHT (0,-1):
      // with '\', reflects UP (-1,0) to (2,1) target!
      '0,5': '\\',
      '5,5': '/',
      '5,1': '\\',
    },
  },
  {
    id: 7,
    title: 'Laser Matrix',
    tier: 'Intermediate',
    cols: 6,
    rows: 6,
    threeStarMoves: 3,
    hint: 'Split the beam in the center to feed both upper and lower sensors.',
    cells: [
      { row: 3, col: 0, type: 'emitter', id: 'e1', direction: 'RIGHT' },
      { row: 3, col: 2, type: 'splitter', id: 's1', orientation: '\\', isRotatable: true },
      { row: 1, col: 2, type: 'mirror', id: 'm1', orientation: '/', isRotatable: true },
      { row: 1, col: 0, type: 'target', id: 't1', targetId: 'target-1' },
      { row: 3, col: 5, type: 'mirror', id: 'm2', orientation: '/', isRotatable: true },
      { row: 5, col: 5, type: 'target', id: 't2', targetId: 'target-2' },
    ],
    solution: {
      // (3,0) RIGHT (0,1) to (3,2):
      // We want reflected to go UP (-1,0):
      // with '/', (0,1) reflects UP (-1,0) to (1,2).
      // and transmitted goes straight RIGHT (0,1) to (3,5).
      // At (1,2) incoming from DOWN (-1,0):
      // we want to go LEFT (0,-1) to (1,0):
      // with '\', (-1,0) reflects to (0,-1) -> LEFT!
      // At (3,5) incoming from LEFT (0,1):
      // we want to go DOWN (1,0) to (5,5):
      // with '\', (0,1) reflects to (1,0) -> DOWN to (5,5) target!
      '3,2': '/',
      '1,2': '\\',
      '3,5': '\\',
    },
  },
  {
    id: 8,
    title: 'Barrier Maze',
    tier: 'Intermediate',
    cols: 7,
    rows: 7,
    threeStarMoves: 4,
    hint: 'Weave through the alternating wall baffles.',
    cells: [
      { row: 1, col: 0, type: 'emitter', id: 'e1', direction: 'RIGHT' },
      { row: 1, col: 5, type: 'mirror', id: 'm1', orientation: '/', isRotatable: true },
      { row: 3, col: 5, type: 'mirror', id: 'm2', orientation: '\\', isRotatable: true },
      { row: 3, col: 1, type: 'mirror', id: 'm3', orientation: '/', isRotatable: true },
      { row: 5, col: 1, type: 'mirror', id: 'm4', orientation: '\\', isRotatable: true },
      { row: 5, col: 6, type: 'target', id: 't1', targetId: 'target-1' },
      // Obstacle walls
      { row: 2, col: 1, type: 'wall', id: 'w1' },
      { row: 2, col: 2, type: 'wall', id: 'w2' },
      { row: 2, col: 3, type: 'wall', id: 'w3' },
      { row: 4, col: 3, type: 'wall', id: 'w4' },
      { row: 4, col: 4, type: 'wall', id: 'w5' },
      { row: 4, col: 5, type: 'wall', id: 'w6' },
    ],
    solution: {
      '1,5': '\\',
      '3,5': '/',
      '3,1': '/',
      '5,1': '\\',
    },
  },
  {
    id: 9,
    title: 'Crosshair',
    tier: 'Intermediate',
    cols: 7,
    rows: 7,
    threeStarMoves: 3,
    hint: 'Reflect the beam across the intersection point.',
    cells: [
      { row: 6, col: 1, type: 'emitter', id: 'e1', direction: 'UP' },
      { row: 1, col: 1, type: 'mirror', id: 'm1', orientation: '\\', isRotatable: true },
      { row: 1, col: 5, type: 'mirror', id: 'm2', orientation: '/', isRotatable: true },
      { row: 4, col: 5, type: 'mirror', id: 'm3', orientation: '\\', isRotatable: true },
      { row: 4, col: 2, type: 'target', id: 't1', targetId: 'target-1' },
      { row: 3, col: 3, type: 'wall', id: 'w1' },
      { row: 2, col: 3, type: 'wall', id: 'w2' },
      { row: 2, col: 2, type: 'wall', id: 'w3' },
    ],
    solution: {
      // (6,1) UP -> (1,1): with '/', reflects RIGHT to (1,5).
      // at (1,5) incoming from LEFT: with '\', reflects DOWN to (4,5).
      // at (4,5) incoming from UP: with '/', reflects LEFT to (4,2) target!
      '1,1': '/',
      '1,5': '\\',
      '4,5': '/',
    },
  },
  {
    id: 10,
    title: 'Bifurcation',
    tier: 'Intermediate',
    cols: 7,
    rows: 7,
    threeStarMoves: 3,
    hint: 'Split the stream to illuminate opposite targets in a symmetric matrix.',
    cells: [
      { row: 3, col: 0, type: 'emitter', id: 'e1', direction: 'RIGHT' },
      { row: 3, col: 3, type: 'splitter', id: 's1', orientation: '\\', isRotatable: true },
      { row: 0, col: 3, type: 'target', id: 't1', targetId: 'target-1' },
      { row: 3, col: 6, type: 'mirror', id: 'm1', orientation: '/', isRotatable: true },
      { row: 6, col: 6, type: 'target', id: 't2', targetId: 'target-2' },
    ],
    solution: {
      // (3,0) RIGHT (0,1) to (3,3):
      // Reflected should go UP (-1,0) to (0,3) Target 1:
      // with '/', (0,1) reflects UP (-1,0).
      // Transmitted continues RIGHT (0,1) to (3,6).
      // At (3,6) incoming from LEFT (0,1):
      // we want to go DOWN (1,0) to (6,6) Target 2:
      // with '\', reflects DOWN to (6,6)!
      '3,3': '/',
      '3,6': '\\',
    },
  },

  // ==========================================
  // ADVANCED (Levels 11 - 15)
  // ==========================================
  {
    id: 11,
    title: 'Quantum Core',
    tier: 'Advanced',
    cols: 7,
    rows: 7,
    threeStarMoves: 3,
    hint: 'A central beam splitter powers three simultaneous nodes.',
    cells: [
      { row: 0, col: 1, type: 'emitter', id: 'e1', direction: 'DOWN' },
      { row: 3, col: 1, type: 'splitter', id: 's1', orientation: '/', isRotatable: true },
      { row: 6, col: 1, type: 'target', id: 't1', targetId: 'target-1' }, // Transmitted
      { row: 3, col: 4, type: 'splitter', id: 's2', orientation: '/', isRotatable: true },
      { row: 1, col: 4, type: 'target', id: 't2', targetId: 'target-2' },
      { row: 3, col: 6, type: 'target', id: 't3', targetId: 'target-3' },
    ],
    solution: {
      // (0,1) DOWN (1,0) to (3,1):
      // Transmitted goes DOWN to (6,1) -> Target 1 hit!
      // Reflected goes RIGHT (0,1) to (3,4):
      // with '\', (1,0) reflects to (0,1) -> RIGHT!
      // At (3,4), incoming from LEFT (0,1):
      // Transmitted continues straight RIGHT to (3,6) -> Target 3 hit!
      // Reflected should go UP (-1,0) to (1,4) -> Target 2 hit!
      // with '/', (0,1) reflects UP (-1,0)!
      '3,1': '\\',
      '3,4': '/',
    },
  },
  {
    id: 12,
    title: 'Prismatic Diamond',
    tier: 'Advanced',
    cols: 7,
    rows: 7,
    threeStarMoves: 4,
    hint: 'Circle around the outer ring and penetrate to the inner sensor.',
    cells: [
      { row: 1, col: 0, type: 'emitter', id: 'e1', direction: 'RIGHT' },
      { row: 1, col: 5, type: 'mirror', id: 'm1', orientation: '/', isRotatable: true },
      { row: 5, col: 5, type: 'mirror', id: 'm2', orientation: '\\', isRotatable: true },
      { row: 5, col: 2, type: 'mirror', id: 'm3', orientation: '/', isRotatable: true },
      { row: 3, col: 2, type: 'mirror', id: 'm4', orientation: '\\', isRotatable: true },
      { row: 3, col: 4, type: 'target', id: 't1', targetId: 'target-1' },
      { row: 2, col: 3, type: 'wall', id: 'w1' },
      { row: 4, col: 3, type: 'wall', id: 'w2' },
    ],
    solution: {
      '1,5': '\\',
      '5,5': '/',
      '5,2': '\\',
      '3,2': '/',
    },
  },
  {
    id: 13,
    title: 'Dual Split',
    tier: 'Advanced',
    cols: 8,
    rows: 8,
    threeStarMoves: 3,
    hint: 'Distribute light through nested beam splitters to three corners.',
    cells: [
      { row: 2, col: 0, type: 'emitter', id: 'e1', direction: 'RIGHT' },
      { row: 2, col: 3, type: 'splitter', id: 's1', orientation: '/', isRotatable: true },
      { row: 2, col: 6, type: 'mirror', id: 'm1', orientation: '\\', isRotatable: true },
      { row: 0, col: 6, type: 'target', id: 't2', targetId: 'target-2' },
      { row: 4, col: 3, type: 'splitter', id: 's2', orientation: '\\', isRotatable: true },
      { row: 6, col: 3, type: 'target', id: 't1', targetId: 'target-1' },
      { row: 4, col: 1, type: 'target', id: 't3', targetId: 'target-3' },
    ],
    solution: {
      // (2,0) RIGHT (0,1) to (2,3):
      // Splitter 1 at (2,3):
      // Transmitted goes RIGHT (0,1) to (2,6).
      // At (2,6) with '/', reflects UP (-1,0) to (0,6) -> Target 2 hit!
      // Reflected at (2,3) goes DOWN (1,0) to (4,3):
      // with '\', (0,1) reflects DOWN (1,0).
      //
      // At (4,3), incoming from UP (1,0):
      // Splitter 2:
      // Transmitted continues DOWN to (6,3) -> Target 1 hit!
      // Reflected: with '/', (1,0) reflects to (0,-1) -> LEFT to (4,1) -> Target 3 hit!
      '2,3': '\\',
      '2,6': '/',
      '4,3': '/',
    },
  },
  {
    id: 14,
    title: 'Photon Labyrinth',
    tier: 'Advanced',
    cols: 8,
    rows: 8,
    threeStarMoves: 4,
    hint: 'Navigate the segmented chamber without losing intensity.',
    cells: [
      { row: 0, col: 1, type: 'emitter', id: 'e1', direction: 'DOWN' },
      { row: 4, col: 1, type: 'splitter', id: 's1', orientation: '/', isRotatable: true },
      { row: 4, col: 4, type: 'mirror', id: 'm1', orientation: '/', isRotatable: true },
      { row: 1, col: 4, type: 'target', id: 't1', targetId: 'target-1' },
      { row: 7, col: 1, type: 'mirror', id: 'm2', orientation: '/', isRotatable: true },
      { row: 7, col: 6, type: 'target', id: 't2', targetId: 'target-2' },
      // Interior walls
      { row: 3, col: 2, type: 'wall', id: 'w1' },
      { row: 3, col: 3, type: 'wall', id: 'w2' },
      { row: 5, col: 2, type: 'wall', id: 'w3' },
      { row: 5, col: 3, type: 'wall', id: 'w4' },
    ],
    solution: {
      // (0,1) DOWN (1,0) to (4,1):
      // Splitter at (4,1):
      // Transmitted goes DOWN to (7,1).
      // At (7,1) incoming from UP: with '\', reflects RIGHT to (7,6) Target 2!
      // Reflected at (4,1) should go RIGHT to (4,4):
      // with '\', (1,0) reflects to (0,1) -> RIGHT to (4,4).
      // At (4,4) incoming from LEFT (0,1):
      // with '/', reflects UP (-1,0) to (1,4) Target 1!
      '4,1': '\\',
      '4,4': '/',
      '7,1': '\\',
    },
  },
  {
    id: 15,
    title: 'The Singularity',
    tier: 'Advanced',
    cols: 8,
    rows: 8,
    threeStarMoves: 5,
    hint: 'The master optical circuit. Light must reach all four quantum corners.',
    cells: [
      { row: 3, col: 0, type: 'emitter', id: 'e1', direction: 'RIGHT' },
      { row: 3, col: 3, type: 'splitter', id: 's1', orientation: '\\', isRotatable: true },
      { row: 1, col: 3, type: 'mirror', id: 'm1', orientation: '/', isRotatable: true },
      { row: 1, col: 7, type: 'target', id: 't1', targetId: 'target-1' },
      { row: 3, col: 5, type: 'splitter', id: 's2', orientation: '/', isRotatable: true },
      { row: 6, col: 5, type: 'target', id: 't2', targetId: 'target-2' },
      { row: 3, col: 7, type: 'target', id: 't3', targetId: 'target-3' },
    ],
    solution: {
      // (3,0) RIGHT (0,1) to (3,3):
      // Splitter 1 at (3,3):
      // We want reflected to go UP (-1,0) to (1,3):
      // with '/', (0,1) reflects UP (-1,0).
      // Transmitted goes straight RIGHT (0,1) to (3,5).
      //
      // Branch 1: At (1,3) incoming from DOWN (-1,0):
      // with '/', reflects RIGHT (0,1) to (1,7) -> Target 1 hit!
      //
      // Branch 2: At (3,5) incoming from LEFT (0,1):
      // Splitter 2:
      // Transmitted continues straight RIGHT to (3,7) -> Target 3 hit!
      // Reflected should go DOWN (1,0) to (6,5) -> Target 2 hit!
      // with '\', (0,1) reflects DOWN (1,0)!
      '3,3': '/',
      '1,3': '/',
      '3,5': '\\',
    },
  },
];

export function getLevelById(id: number): LaserLevel | undefined {
  return LASER_LEVELS.find((lvl) => lvl.id === id);
}
