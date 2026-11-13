import type { Obstacle, ObstacleType } from './types';
import { GAME_CONSTANTS } from './physics';

let obstacleCounter = 0;

export function createObstacle(
  x: number,
  type: ObstacleType,
  width: number = 32,
  height: number = 48
): Obstacle {
  obstacleCounter++;
  let y = 0;

  if (type === 'spike-bottom' || type === 'block-bottom') {
    y = GAME_CONSTANTS.FLOOR_Y - height;
  } else if (type === 'spike-top' || type === 'block-top') {
    y = GAME_CONSTANTS.CEILING_Y;
  } else if (type === 'barrier-middle') {
    y = (GAME_CONSTANTS.FLOOR_Y + GAME_CONSTANTS.CEILING_Y) / 2 - height / 2;
  }

  return {
    id: `obs_${obstacleCounter}_${Date.now()}`,
    x,
    y,
    width,
    height,
    type,
    passed: false,
  };
}

export function generateClassicObstacles(level: number): Obstacle[] {
  const obstacles: Obstacle[] = [];
  obstacleCounter = 0;

  if (level === 1) {
    // Level 1: Gentle introduction, generous spacing (350-450px)
    // Distance ~600m
    const patterns: { x: number; type: ObstacleType; h?: number }[] = [
      { x: 500, type: 'spike-bottom', h: 42 },
      { x: 900, type: 'spike-top', h: 42 },
      { x: 1300, type: 'spike-bottom', h: 42 },
      { x: 1700, type: 'spike-top', h: 42 },
      { x: 2150, type: 'block-bottom', h: 50 },
      { x: 2600, type: 'spike-bottom', h: 45 },
      { x: 3050, type: 'spike-top', h: 45 },
      { x: 3500, type: 'spike-bottom', h: 42 },
      { x: 3950, type: 'spike-top', h: 42 },
    ];

    patterns.forEach((p) => {
      obstacles.push(createObstacle(p.x, p.type, 34, p.h || 45));
    });
  } else if (level === 2) {
    // Level 2: Shorter gaps (280-360px), dual spikes
    const patterns: { x: number; type: ObstacleType; h?: number; w?: number }[] = [
      { x: 450, type: 'spike-bottom', h: 46 },
      { x: 800, type: 'spike-top', h: 46 },
      { x: 1150, type: 'barrier-middle', h: 100, w: 28 },
      { x: 1550, type: 'spike-bottom', h: 46 },
      { x: 1900, type: 'spike-top', h: 46 },
      { x: 2280, type: 'block-bottom', h: 55 },
      { x: 2650, type: 'spike-top', h: 48 },
      { x: 3000, type: 'barrier-middle', h: 90, w: 28 },
      { x: 3400, type: 'spike-bottom', h: 48 },
      { x: 3750, type: 'spike-top', h: 48 },
      { x: 4150, type: 'spike-bottom', h: 50 },
      { x: 4550, type: 'spike-top', h: 50 },
    ];

    patterns.forEach((p) => {
      obstacles.push(createObstacle(p.x, p.type, p.w || 34, p.h || 46));
    });
  } else {
    // Level 3: Intense challenge, rhythmic flips, barrier gates
    const patterns: { x: number; type: ObstacleType; h?: number; w?: number }[] = [
      { x: 400, type: 'spike-bottom', h: 48 },
      { x: 720, type: 'spike-top', h: 48 },
      { x: 1040, type: 'spike-bottom', h: 48 },
      { x: 1360, type: 'barrier-middle', h: 110, w: 30 },
      { x: 1720, type: 'spike-top', h: 50 },
      { x: 2040, type: 'spike-bottom', h: 50 },
      { x: 2380, type: 'block-bottom', h: 56 },
      { x: 2720, type: 'block-top', h: 56 },
      { x: 3080, type: 'spike-bottom', h: 50 },
      { x: 3420, type: 'barrier-middle', h: 120, w: 30 },
      { x: 3800, type: 'spike-top', h: 50 },
      { x: 4140, type: 'spike-bottom', h: 50 },
      { x: 4500, type: 'spike-top', h: 52 },
      { x: 4860, type: 'barrier-middle', h: 110, w: 30 },
      { x: 5240, type: 'spike-bottom', h: 52 },
      { x: 5600, type: 'spike-top', h: 52 },
    ];

    patterns.forEach((p) => {
      obstacles.push(createObstacle(p.x, p.type, p.w || 34, p.h || 48));
    });
  }

  return obstacles;
}

export function generateNextEndlessObstacle(
  lastX: number,
  currentSpeed: number,
  lastType?: ObstacleType
): Obstacle {
  // Safe solvable distance calculation:
  // Reaction time (~0.35s) + transit time (~0.38s) = ~0.73s minimum
  const minSafeDistance = Math.max(280, currentSpeed * 0.72);
  const randomVariance = Math.random() * 120;
  const nextX = lastX + minSafeDistance + randomVariance;

  // Alternate smartly so obstacles aren't unfairly clumped
  const pool: ObstacleType[] = ['spike-bottom', 'spike-top', 'block-bottom', 'block-top', 'barrier-middle'];

  let chosenType: ObstacleType = pool[Math.floor(Math.random() * pool.length)];

  // Prevent 3 in a row on same rail
  if (lastType && chosenType === lastType && Math.random() < 0.65) {
    chosenType = lastType.includes('bottom') ? 'spike-top' : 'spike-bottom';
  }

  let height = 45;
  let width = 34;

  if (chosenType === 'barrier-middle') {
    height = 90 + Math.floor(Math.random() * 30);
    width = 28;
  } else if (chosenType.startsWith('block')) {
    height = 45 + Math.floor(Math.random() * 20);
    width = 40;
  } else {
    height = 42 + Math.floor(Math.random() * 14);
  }

  return createObstacle(nextX, chosenType, width, height);
}
