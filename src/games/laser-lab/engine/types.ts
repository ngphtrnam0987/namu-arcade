export type Direction = 'UP' | 'RIGHT' | 'DOWN' | 'LEFT';

export type MirrorOrientation = '/' | '\\';

export type CellType = 'empty' | 'emitter' | 'mirror' | 'splitter' | 'wall' | 'target';

export interface GridCell {
  row: number;
  col: number;
  type: CellType;
  id: string;

  // For emitter
  direction?: Direction;

  // For mirror & splitter
  orientation?: MirrorOrientation;
  isRotatable?: boolean;

  // For target
  targetId?: string;
  isHit?: boolean;
}

export interface LaserSegment {
  r1: number;
  c1: number;
  r2: number;
  c2: number;
  color: string;
}

export interface TraceResult {
  segments: LaserSegment[];
  hitTargetIds: string[];
  allTargetsHit: boolean;
}

export interface LaserLevel {
  id: number;
  title: string;
  tier: 'Beginner' | 'Intermediate' | 'Advanced';
  cols: number;
  rows: number;
  threeStarMoves: number;
  hint: string;
  cells: GridCell[];
  // Reference solution rotations: key is `${row},${col}` -> orientation '/' or '\'
  solution?: Record<string, MirrorOrientation>;
}
