export type GravityDirection = 1 | -1; // 1 = down (floor), -1 = up (ceiling)

export interface TrailPoint {
  x: number;
  y: number;
  alpha: number;
  size: number;
}

export interface Player {
  x: number;
  y: number;
  vy: number;
  width: number;
  height: number;
  gravityDir: GravityDirection;
  isGrounded: boolean;
  rotation: number;
  trail: TrailPoint[];
  color: string;
}

export type ObstacleType = 'spike-bottom' | 'spike-top' | 'block-bottom' | 'block-top' | 'barrier-middle';

export interface Obstacle {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: ObstacleType;
  passed: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  alpha: number;
}

export type GravityGameMode = 'classic' | 'endless';
export type GravityGameStatus = 'idle' | 'running' | 'paused' | 'gameover' | 'victory';

export interface ClassicLevel {
  level: number;
  name: string;
  targetDistance: number;
  speed: number;
  description: string;
}
