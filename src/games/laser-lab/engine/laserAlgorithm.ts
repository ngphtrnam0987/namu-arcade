import type { GridCell, LaserSegment, TraceResult, Direction, MirrorOrientation } from './types';

const DIR_VECTORS: Record<Direction, { dr: number; dc: number }> = {
  UP: { dr: -1, dc: 0 },
  DOWN: { dr: 1, dc: 0 },
  LEFT: { dr: 0, dc: -1 },
  RIGHT: { dr: 0, dc: 1 },
};

function reflect(dr: number, dc: number, orientation: MirrorOrientation): { dr: number; dc: number } {
  if (orientation === '/') {
    // Reflects: (1, 0) -> (0, -1); (-1, 0) -> (0, 1); (0, 1) -> (-1, 0); (0, -1) -> (1, 0)
    return { dr: -dc, dc: -dr };
  } else {
    // '\' Reflects: (1, 0) -> (0, 1); (-1, 0) -> (0, -1); (0, 1) -> (1, 0); (0, -1) -> (-1, 0)
    return { dr: dc, dc: dr };
  }
}

export function traceLaserRays(cells: GridCell[], cols: number, rows: number): TraceResult {
  // Map lookup by "r,c"
  const cellMap = new Map<string, GridCell>();
  let totalTargets = 0;
  const allTargetIds = new Set<string>();
  const emitters: GridCell[] = [];

  for (const cell of cells) {
    cellMap.set(`${cell.row},${cell.col}`, cell);
    if (cell.type === 'target') {
      totalTargets++;
      if (cell.targetId) allTargetIds.add(cell.targetId);
    }
    if (cell.type === 'emitter') {
      emitters.push(cell);
    }
  }

  const segments: LaserSegment[] = [];
  const hitTargetIds = new Set<string>();
  const visitedStates = new Set<string>(); // "r,c,dr,dc" to avoid infinite bounce loops

  interface RayQueueItem {
    r: number;
    c: number;
    dr: number;
    dc: number;
    color: string;
  }

  const rayQueue: RayQueueItem[] = [];

  for (const em of emitters) {
    const dir = em.direction || 'RIGHT';
    const vec = DIR_VECTORS[dir];
    rayQueue.push({
      r: em.row,
      c: em.col,
      dr: vec.dr,
      dc: vec.dc,
      color: '#00F0FF',
    });
  }

  let steps = 0;
  const MAX_STEPS = 120;

  while (rayQueue.length > 0 && steps < MAX_STEPS) {
    steps++;
    const ray = rayQueue.shift()!;
    const stateKey = `${ray.r},${ray.c},${ray.dr},${ray.dc}`;

    if (visitedStates.has(stateKey)) continue;
    visitedStates.add(stateKey);

    const nextR = ray.r + ray.dr;
    const nextC = ray.c + ray.dc;

    // Boundary check
    if (nextR < 0 || nextR >= rows || nextC < 0 || nextC >= cols) {
      // Beam exits grid
      segments.push({
        r1: ray.r,
        c1: ray.c,
        r2: nextR,
        c2: nextC,
        color: ray.color,
      });
      continue;
    }

    // Add segment to next cell
    segments.push({
      r1: ray.r,
      c1: ray.c,
      r2: nextR,
      c2: nextC,
      color: ray.color,
    });

    const nextCell = cellMap.get(`${nextR},${nextC}`);
    if (!nextCell || nextCell.type === 'empty') {
      // Continue through empty cell
      rayQueue.push({
        r: nextR,
        c: nextC,
        dr: ray.dr,
        dc: ray.dc,
        color: ray.color,
      });
      continue;
    }

    if (nextCell.type === 'wall') {
      // Ray stops at wall
      continue;
    }

    if (nextCell.type === 'target') {
      // Hit target!
      if (nextCell.targetId) hitTargetIds.add(nextCell.targetId);
      // Laser can stop at target or pass through
      continue;
    }

    if (nextCell.type === 'mirror' && nextCell.orientation) {
      // Reflect ray
      const reflected = reflect(ray.dr, ray.dc, nextCell.orientation);
      rayQueue.push({
        r: nextR,
        c: nextC,
        dr: reflected.dr,
        dc: reflected.dc,
        color: ray.color,
      });
      continue;
    }

    if (nextCell.type === 'splitter' && nextCell.orientation) {
      // 1. Reflected branch (colored purple)
      const reflected = reflect(ray.dr, ray.dc, nextCell.orientation);
      rayQueue.push({
        r: nextR,
        c: nextC,
        dr: reflected.dr,
        dc: reflected.dc,
        color: '#A855F7',
      });

      // 2. Transmitted straight-through branch (colored cyan)
      rayQueue.push({
        r: nextR,
        c: nextC,
        dr: ray.dr,
        dc: ray.dc,
        color: '#00F0FF',
      });
      continue;
    }
  }

  const allHit = totalTargets > 0 && hitTargetIds.size >= totalTargets;

  return {
    segments,
    hitTargetIds: Array.from(hitTargetIds),
    allTargetsHit: allHit,
  };
}
