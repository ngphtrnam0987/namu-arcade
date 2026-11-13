import { describe, it, expect } from 'vitest';
import { traceLaserRays } from '../games/laser-lab/engine/laserAlgorithm';
import { LASER_LEVELS } from '../games/laser-lab/engine/levels';
import type { GridCell } from '../games/laser-lab/engine/types';

describe('Laser Lab Optics Engine', () => {
  it('traces a direct beam from emitter to target', () => {
    const cells: GridCell[] = [
      { row: 1, col: 0, type: 'emitter', id: 'e1', direction: 'RIGHT' },
      { row: 1, col: 3, type: 'target', id: 't1', targetId: 'target-1' },
    ];

    const result = traceLaserRays(cells, 5, 5);
    expect(result.allTargetsHit).toBe(true);
    expect(result.hitTargetIds).toContain('target-1');
    expect(result.segments.length).toBeGreaterThan(0);
  });

  it('reflects beam 90 degrees on angled mirrors', () => {
    // Emitter at (0, 0) facing DOWN -> Mirror at (2, 0) with '\' -> reflects RIGHT -> Target at (2, 4)
    const cells: GridCell[] = [
      { row: 0, col: 0, type: 'emitter', id: 'e1', direction: 'DOWN' },
      { row: 2, col: 0, type: 'mirror', id: 'm1', orientation: '\\' },
      { row: 2, col: 4, type: 'target', id: 't1', targetId: 'target-1' },
    ];

    const result = traceLaserRays(cells, 5, 5);
    expect(result.allTargetsHit).toBe(true);
    expect(result.hitTargetIds).toContain('target-1');
  });

  it('stops beam on encountering a wall obstacle', () => {
    const cells: GridCell[] = [
      { row: 1, col: 0, type: 'emitter', id: 'e1', direction: 'RIGHT' },
      { row: 1, col: 2, type: 'wall', id: 'w1' },
      { row: 1, col: 4, type: 'target', id: 't1', targetId: 'target-1' },
    ];

    const result = traceLaserRays(cells, 5, 5);
    expect(result.allTargetsHit).toBe(false);
    expect(result.hitTargetIds.length).toBe(0);
  });

  it('splits beam into transmitted and reflected paths with beam splitter', () => {
    // Emitter at (2, 0) facing RIGHT -> Splitter at (2, 2) with '\'
    // Transmitted goes RIGHT to Target 1 at (2, 4)
    // Reflected goes DOWN to Target 2 at (4, 2)
    const cells: GridCell[] = [
      { row: 2, col: 0, type: 'emitter', id: 'e1', direction: 'RIGHT' },
      { row: 2, col: 2, type: 'splitter', id: 's1', orientation: '\\' },
      { row: 2, col: 4, type: 'target', id: 't1', targetId: 'target-1' },
      { row: 4, col: 2, type: 'target', id: 't2', targetId: 'target-2' },
    ];

    const result = traceLaserRays(cells, 5, 5);
    expect(result.allTargetsHit).toBe(true);
    expect(result.hitTargetIds).toContain('target-1');
    expect(result.hitTargetIds).toContain('target-2');
  });

  it('prevents infinite recursion loops when mirrors face each other', () => {
    const cells: GridCell[] = [
      { row: 1, col: 0, type: 'emitter', id: 'e1', direction: 'RIGHT' },
      { row: 1, col: 2, type: 'mirror', id: 'm1', orientation: '/' }, // reflects UP
      { row: 0, col: 2, type: 'mirror', id: 'm2', orientation: '/' }, // reflects RIGHT
      { row: 0, col: 3, type: 'mirror', id: 'm3', orientation: '\\' }, // reflects DOWN
      { row: 1, col: 3, type: 'mirror', id: 'm4', orientation: '\\' }, // reflects LEFT back into loop
    ];

    // Must not crash or hang
    const result = traceLaserRays(cells, 5, 5);
    expect(result.segments.length).toBeLessThan(120);
  });

  it('verifies that all 15 levels are strictly solvable with at least one valid solution', () => {
    expect(LASER_LEVELS.length).toBe(15);

    for (const lvl of LASER_LEVELS) {
      expect(lvl.solution).toBeDefined();

      // Apply declared solution orientations to level cells
      const solvedCells = lvl.cells.map((cell) => {
        const key = `${cell.row},${cell.col}`;
        if (lvl.solution && lvl.solution[key]) {
          return {
            ...cell,
            orientation: lvl.solution[key],
          };
        }
        return cell;
      });

      const result = traceLaserRays(solvedCells, lvl.cols, lvl.rows);

      // Every single level must achieve allTargetsHit = true with its solution!
      expect(
        result.allTargetsHit,
        `Level ${lvl.id} ("${lvl.title}") failed to solve with declared solution!`
      ).toBe(true);
    }
  });
});
