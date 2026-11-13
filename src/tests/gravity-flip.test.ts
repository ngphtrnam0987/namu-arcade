import { describe, it, expect } from 'vitest';
import {
  createInitialPlayer,
  flipPlayerGravity,
  updatePlayerPhysics,
  checkCollision,
  GAME_CONSTANTS,
  CLASSIC_LEVELS,
} from '../games/gravity-flip/engine/physics';
import {
  createObstacle,
  generateClassicObstacles,
  generateNextEndlessObstacle,
} from '../games/gravity-flip/engine/generator';

describe('Gravity Flip Engine', () => {
  it('initializes player on floor with normal gravity', () => {
    const player = createInitialPlayer();
    expect(player.gravityDir).toBe(1);
    expect(player.y).toBe(GAME_CONSTANTS.FLOOR_Y - GAME_CONSTANTS.PLAYER_SIZE);
    expect(player.isGrounded).toBe(true);
  });

  it('inverts gravity and applies upward impulse on flip', () => {
    const player = createInitialPlayer();
    const flipped = flipPlayerGravity(player);
    expect(flipped).toBe(true);
    expect(player.gravityDir).toBe(-1);
    expect(player.vy).toBeLessThan(0);
    expect(player.isGrounded).toBe(false);
  });

  it('clamps player accurately at ceiling rail when falling upward', () => {
    const player = createInitialPlayer();
    player.gravityDir = -1;
    player.y = GAME_CONSTANTS.CEILING_Y + 10;
    player.vy = -500;

    // Simulate 0.1s
    updatePlayerPhysics(player, 0.1);

    expect(player.y).toBe(GAME_CONSTANTS.CEILING_Y);
    expect(player.vy).toBe(0);
    expect(player.isGrounded).toBe(true);
  });

  it('clamps player accurately at floor rail when falling downward', () => {
    const player = createInitialPlayer();
    player.gravityDir = 1;
    player.y = GAME_CONSTANTS.FLOOR_Y - 20;
    player.vy = 400;

    // Simulate 0.1s
    updatePlayerPhysics(player, 0.1);

    expect(player.y).toBe(GAME_CONSTANTS.FLOOR_Y - player.height);
    expect(player.vy).toBe(0);
    expect(player.isGrounded).toBe(true);
  });

  it('detects collision when player intersects obstacle', () => {
    const player = createInitialPlayer();
    // Position obstacle directly at player
    const obstacle = createObstacle(player.x, 'spike-bottom', 32, 48);

    const isHit = checkCollision(player, obstacle);
    expect(isHit).toBe(true);
  });

  it('returns no collision when player is far away from obstacle', () => {
    const player = createInitialPlayer();
    const obstacle = createObstacle(player.x + 300, 'spike-bottom', 32, 48);

    const isHit = checkCollision(player, obstacle);
    expect(isHit).toBe(false);
  });

  it('generates valid obstacle layouts for all 3 classic levels', () => {
    for (const lvl of CLASSIC_LEVELS) {
      const obstacles = generateClassicObstacles(lvl.level);
      expect(obstacles.length).toBeGreaterThan(5);

      // Verify all obstacles are within corridor boundaries
      obstacles.forEach((obs) => {
        expect(obs.x).toBeGreaterThan(200);
        expect(obs.y).toBeGreaterThanOrEqual(GAME_CONSTANTS.CEILING_Y);
        expect(obs.y + obs.height).toBeLessThanOrEqual(GAME_CONSTANTS.FLOOR_Y + 1);
      });
    }
  });

  it('endless obstacle generator maintains safe solvable distance for human reflex', () => {
    const lastX = 500;
    const speed = 400;
    const nextObs = generateNextEndlessObstacle(lastX, speed);

    // Guaranteed spacing at 400px/s must be at least 280px
    expect(nextObs.x - lastX).toBeGreaterThanOrEqual(280);
  });
});
