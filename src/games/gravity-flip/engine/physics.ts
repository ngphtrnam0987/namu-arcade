import type { Player, Obstacle, GravityDirection, ClassicLevel } from './types';

export const GAME_CONSTANTS = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 450,
  CEILING_Y: 55,
  FLOOR_Y: 395,
  GRAVITY_ACCEL: 2400,
  MAX_VY: 850,
  PLAYER_SIZE: 32,
  HITBOX_INSET: 4,
};

export const CLASSIC_LEVELS: ClassicLevel[] = [
  {
    level: 1,
    name: 'Neon Corridor',
    targetDistance: 600,
    speed: 320,
    description: 'Learn the fundamentals of gravity inversion. Dodge stationary spikes along the cyber track.',
  },
  {
    level: 2,
    name: 'Cyber Rift',
    targetDistance: 950,
    speed: 380,
    description: 'Faster track velocity, alternating ceiling spikes and narrow floating obstacles.',
  },
  {
    level: 3,
    name: 'Hyper Velocity',
    targetDistance: 1350,
    speed: 450,
    description: 'Extreme reflex test with rapid alternating flips and dense hazard gates.',
  },
];

export function createInitialPlayer(): Player {
  return {
    x: 100,
    y: GAME_CONSTANTS.FLOOR_Y - GAME_CONSTANTS.PLAYER_SIZE,
    vy: 0,
    width: GAME_CONSTANTS.PLAYER_SIZE,
    height: GAME_CONSTANTS.PLAYER_SIZE,
    gravityDir: 1, // down
    isGrounded: true,
    rotation: 0,
    trail: [],
    color: '#00F0FF',
  };
}

export function updatePlayerPhysics(player: Player, dt: number): void {
  // Apply gravity acceleration
  player.vy += player.gravityDir * GAME_CONSTANTS.GRAVITY_ACCEL * dt;

  // Clamp vertical velocity
  if (player.vy > GAME_CONSTANTS.MAX_VY) player.vy = GAME_CONSTANTS.MAX_VY;
  if (player.vy < -GAME_CONSTANTS.MAX_VY) player.vy = -GAME_CONSTANTS.MAX_VY;

  // Move
  player.y += player.vy * dt;

  // Check boundary collisions
  // 1. Floor collision
  if (player.gravityDir === 1 && player.y + player.height >= GAME_CONSTANTS.FLOOR_Y) {
    player.y = GAME_CONSTANTS.FLOOR_Y - player.height;
    player.vy = 0;
    player.isGrounded = true;
    player.rotation = 0;
  }
  // 2. Ceiling collision
  else if (player.gravityDir === -1 && player.y <= GAME_CONSTANTS.CEILING_Y) {
    player.y = GAME_CONSTANTS.CEILING_Y;
    player.vy = 0;
    player.isGrounded = true;
    player.rotation = Math.PI;
  } else {
    player.isGrounded = false;
    // Rotate smoothly in mid-air
    const targetAngle = player.gravityDir === 1 ? 0 : Math.PI;
    player.rotation += (targetAngle - player.rotation) * Math.min(1, dt * 15);
  }

  // Update trail
  player.trail.unshift({
    x: player.x,
    y: player.y + player.height / 2,
    alpha: 0.6,
    size: player.height * 0.7,
  });

  // Fade trail
  for (let i = player.trail.length - 1; i >= 0; i--) {
    player.trail[i].alpha -= dt * 2.5;
    player.trail[i].size -= dt * 15;
    player.trail[i].x -= 8; // trail drifts back
    if (player.trail[i].alpha <= 0 || player.trail[i].size <= 0) {
      player.trail.splice(i, 1);
    }
  }

  // Cap trail length
  if (player.trail.length > 12) {
    player.trail.length = 12;
  }
}

export function flipPlayerGravity(player: Player): boolean {
  // Can invert gravity
  player.gravityDir = (player.gravityDir * -1) as GravityDirection;
  player.vy = player.gravityDir * 250; // Initial impulse toward opposite wall
  player.isGrounded = false;
  return true;
}

export function checkCollision(player: Player, obs: Obstacle): boolean {
  const inset = GAME_CONSTANTS.HITBOX_INSET;

  const playerBox = {
    left: player.x + inset,
    right: player.x + player.width - inset,
    top: player.y + inset,
    bottom: player.y + player.height - inset,
  };

  const obsBox = {
    left: obs.x + 3,
    right: obs.x + obs.width - 3,
    top: obs.y + 3,
    bottom: obs.y + obs.height - 3,
  };

  return (
    playerBox.left < obsBox.right &&
    playerBox.right > obsBox.left &&
    playerBox.top < obsBox.bottom &&
    playerBox.bottom > obsBox.top
  );
}
