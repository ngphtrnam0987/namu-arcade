import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { LASER_LEVELS, getLevelById } from './engine/levels';
import { traceLaserRays } from './engine/laserAlgorithm';
import type { GridCell, MirrorOrientation, TraceResult } from './engine/types';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { soundService } from '../../services/sound';
import {
  RotateCcw,
  Undo2,
  Star,
  ArrowRight,
  Info,
  Sparkles,
  Layers,
  Volume2,
  VolumeX,
} from 'lucide-react';

export const LaserLabGame: React.FC = () => {
  const [levelId, setLevelId] = useState<number>(1);
  const currentLevel = useMemo(() => getLevelById(levelId) || LASER_LEVELS[0], [levelId]);

  // Game board state
  const [cells, setCells] = useState<GridCell[]>(() =>
    currentLevel.cells.map((c) => ({ ...c }))
  );
  const [moves, setMoves] = useState<number>(0);
  const [history, setHistory] = useState<GridCell[][]>([]);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [showLevelSelect, setShowLevelSelect] = useState<boolean>(false);

  // Store
  const { laserLab, recordLaserLevelSolve } = usePlayerStore();
  const { isMuted, toggleMute } = useSettingsStore();

  // Reset or load level
  const loadLevel = useCallback(
    (lvlId: number) => {
      soundService.playClick();
      const targetLvl = getLevelById(lvlId) || LASER_LEVELS[0];
      setLevelId(targetLvl.id);
      setCells(targetLvl.cells.map((c) => ({ ...c })));
      setMoves(0);
      setHistory([]);
      setIsWon(false);
      setShowLevelSelect(false);
    },
    []
  );

  // When levelId changes, reset cells
  useEffect(() => {
    loadLevel(levelId);
  }, [levelId, loadLevel]);

  // Trace laser rays in real-time
  const traceResult: TraceResult = useMemo(() => {
    return traceLaserRays(cells, currentLevel.cols, currentLevel.rows);
  }, [cells, currentLevel.cols, currentLevel.rows]);

  // Handle Win Condition
  useEffect(() => {
    if (traceResult.allTargetsHit && !isWon) {
      setIsWon(true);
      soundService.playTargetHit();
      soundService.playVictory();

      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch {}

      // Calculate star rating
      let earnedStars = 1;
      if (moves <= currentLevel.threeStarMoves) {
        earnedStars = 3;
      } else if (moves <= currentLevel.threeStarMoves + 2) {
        earnedStars = 2;
      }

      recordLaserLevelSolve(levelId, earnedStars, moves);
    }
  }, [traceResult.allTargetsHit, isWon, moves, currentLevel.threeStarMoves, levelId, recordLaserLevelSolve]);

  // Rotate Mirror or Splitter
  const handleCellClick = (row: number, col: number) => {
    if (isWon) return;

    const targetIndex = cells.findIndex((c) => c.row === row && c.col === col);
    if (targetIndex === -1) return;

    const cell = cells[targetIndex];
    if ((cell.type === 'mirror' || cell.type === 'splitter') && cell.isRotatable) {
      soundService.playLaserBounce();

      // Save to undo history
      setHistory((prev) => [...prev, cells.map((c) => ({ ...c }))]);

      // Toggle orientation: '/' <-> '\'
      const nextOrientation: MirrorOrientation = cell.orientation === '/' ? '\\' : '/';

      const updatedCells = [...cells];
      updatedCells[targetIndex] = {
        ...cell,
        orientation: nextOrientation,
      };

      setCells(updatedCells);
      setMoves((m) => m + 1);
    }
  };

  // Undo Move
  const handleUndo = () => {
    if (history.length === 0 || isWon) return;
    soundService.playClick();
    const previousState = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setCells(previousState);
    setMoves((m) => Math.max(0, m - 1));
  };

  // Reset Level
  const handleReset = () => {
    soundService.playClick();
    setCells(currentLevel.cells.map((c) => ({ ...c })));
    setMoves(0);
    setHistory([]);
    setIsWon(false);
  };

  // Keyboard shortcut listener for Laser Lab (Z to undo, R to reset)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.code === 'KeyZ' && (e.ctrlKey || e.metaKey)) || e.code === 'KeyZ') {
        e.preventDefault();
        handleUndo();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        handleReset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Calculate current stars preview
  const currentStars = moves <= currentLevel.threeStarMoves ? 3 : moves <= currentLevel.threeStarMoves + 2 ? 2 : 1;

  // Grid sizing calculations
  const cellSize = 64; // px per cell
  const boardWidth = currentLevel.cols * cellSize;
  const boardHeight = currentLevel.rows * cellSize;

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto space-y-4">
      {/* Top Controls & Status Bar */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl glass-panel border border-slate-800">
        {/* Level Switcher & Tier */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundService.playClick();
              setShowLevelSelect(true);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-violet-950/80 text-violet-300 border border-violet-700/60 hover:bg-violet-900/60 shadow-[0_0_12px_rgba(168,85,247,0.25)] transition"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Level {levelId} / 15</span>
          </button>

          <span
            className={`text-xs font-mono uppercase px-2 py-0.5 rounded-full border ${
              currentLevel.tier === 'Beginner'
                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-700/50'
                : currentLevel.tier === 'Intermediate'
                ? 'bg-cyan-950/60 text-cyan-400 border-cyan-700/50'
                : 'bg-purple-950/60 text-purple-400 border-purple-700/50'
            }`}
          >
            {currentLevel.tier}
          </span>
        </div>

        {/* Moves & Target Stars */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-400">Moves: </span>
            <span className="font-bold text-white text-sm">{moves}</span>
            <span className="text-slate-500 text-[10px]"> (Goal: ≤{currentLevel.threeStarMoves})</span>
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3].map((starIdx) => (
              <Star
                key={starIdx}
                className={`w-4 h-4 ${
                  starIdx <= currentStars ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              soundService.playClick();
              toggleMute();
            }}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
            title="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Hint Banner */}
      <div className="w-full flex items-center justify-between gap-2 px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="italic">{currentLevel.hint}</span>
        </div>
        <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">Click/Tap mirrors to rotate</span>
      </div>

      {/* Main Laser Grid Board */}
      <div className="relative p-4 sm:p-6 rounded-3xl glass-panel border border-violet-500/30 shadow-[0_0_35px_rgba(168,85,247,0.15)] flex justify-center items-center overflow-x-auto max-w-full">
        <svg
          width={boardWidth}
          height={boardHeight}
          className="select-none bg-[#090616] rounded-2xl shadow-inner border border-slate-800"
          style={{ minWidth: boardWidth, minHeight: boardHeight }}
        >
          {/* Defs for Glow Filters and Gradients */}
          <defs>
            <filter id="laserGlowCyan" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="4" result="blur1" />
              <feGaussianBlur stdDeviation="8" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="laserGlowPurple" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid Background Lines */}
          {Array.from({ length: currentLevel.rows + 1 }).map((_, r) => (
            <line
              key={`h-${r}`}
              x1={0}
              y1={r * cellSize}
              x2={boardWidth}
              y2={r * cellSize}
              stroke="rgba(168, 85, 247, 0.12)"
              strokeWidth={1}
            />
          ))}
          {Array.from({ length: currentLevel.cols + 1 }).map((_, c) => (
            <line
              key={`v-${c}`}
              x1={c * cellSize}
              y1={0}
              x2={c * cellSize}
              y2={boardHeight}
              stroke="rgba(168, 85, 247, 0.12)"
              strokeWidth={1}
            />
          ))}

          {/* Laser Beams Layer (Rendered below mirrors and targets) */}
          {traceResult.segments.map((seg, idx) => {
            const x1 = seg.c1 * cellSize + cellSize / 2;
            const y1 = seg.r1 * cellSize + cellSize / 2;
            const x2 = seg.c2 * cellSize + cellSize / 2;
            const y2 = seg.r2 * cellSize + cellSize / 2;

            return (
              <g key={`beam-${idx}`}>
                {/* Thick outer blur glow */}
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={seg.color}
                  strokeWidth={8}
                  strokeOpacity={0.35}
                  filter="url(#laserGlowCyan)"
                />
                {/* Sharp core beam */}
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#FFFFFF"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
              </g>
            );
          })}

          {/* Interactive Cell Elements */}
          {cells.map((cell) => {
            const cx = cell.col * cellSize + cellSize / 2;
            const cy = cell.row * cellSize + cellSize / 2;
            const key = `${cell.row},${cell.col}`;

            // Emitter
            if (cell.type === 'emitter') {
              let angle = 0;
              if (cell.direction === 'DOWN') angle = 90;
              if (cell.direction === 'LEFT') angle = 180;
              if (cell.direction === 'UP') angle = 270;

              return (
                <g key={key} transform={`translate(${cx}, ${cy}) rotate(${angle})`}>
                  <circle cx={0} cy={0} r={22} fill="#0d1428" stroke="#00F0FF" strokeWidth={2.5} />
                  <circle cx={0} cy={0} r={10} fill="#00F0FF" filter="url(#laserGlowCyan)" />
                  {/* Arrow nozzle */}
                  <polygon points="18,0 8,-7 8,7" fill="#00F0FF" />
                </g>
              );
            }

            // Target Sensor
            if (cell.type === 'target') {
              const isHit = traceResult.hitTargetIds.includes(cell.targetId || '');
              const targetColor = isHit ? '#10B981' : '#EC4899';

              return (
                <g key={key} transform={`translate(${cx}, ${cy})`}>
                  {/* Target Outer Disc */}
                  <circle
                    cx={0}
                    cy={0}
                    r={22}
                    fill={isHit ? 'rgba(16, 185, 129, 0.25)' : 'rgba(236, 72, 153, 0.15)'}
                    stroke={targetColor}
                    strokeWidth={isHit ? 3 : 2}
                    filter={isHit ? 'url(#laserGlowCyan)' : undefined}
                  />
                  {/* Middle Ring */}
                  <circle cx={0} cy={0} r={14} fill="none" stroke={targetColor} strokeWidth={1.5} strokeDasharray={isHit ? undefined : '3 3'} />
                  {/* Core Sensor Dot */}
                  <circle cx={0} cy={0} r={6} fill={isHit ? '#FFFFFF' : targetColor} />
                </g>
              );
            }

            // Wall Obstacle
            if (cell.type === 'wall') {
              return (
                <g key={key} transform={`translate(${cx}, ${cy})`}>
                  <rect
                    x={-cellSize / 2 + 6}
                    y={-cellSize / 2 + 6}
                    width={cellSize - 12}
                    height={cellSize - 12}
                    rx={6}
                    fill="#1e2436"
                    stroke="#475569"
                    strokeWidth={2}
                  />
                  {/* Hazard slash pattern */}
                  <line x1={-12} y1={-12} x2={12} y2={12} stroke="#334155" strokeWidth={2} />
                  <line x1={-12} y1={12} x2={12} y2={-12} stroke="#334155" strokeWidth={2} />
                </g>
              );
            }

            // Mirror
            if (cell.type === 'mirror') {
              // Orientation: '/' = 45 deg, '\' = 135 deg
              const angle = cell.orientation === '/' ? -45 : 45;

              return (
                <g
                  key={key}
                  transform={`translate(${cx}, ${cy})`}
                  className="cursor-pointer group"
                  onClick={() => handleCellClick(cell.row, cell.col)}
                >
                  {/* Hover background tile */}
                  <rect
                    x={-cellSize / 2 + 3}
                    y={-cellSize / 2 + 3}
                    width={cellSize - 6}
                    height={cellSize - 6}
                    rx={10}
                    fill="rgba(30, 27, 75, 0.6)"
                    stroke="rgba(168, 85, 247, 0.3)"
                    strokeWidth={1}
                    className="transition group-hover:stroke-cyan-400 group-hover:fill-slate-900"
                  />

                  {/* Mirror Disc */}
                  <circle cx={0} cy={0} r={20} fill="#0d111e" stroke="#A855F7" strokeWidth={2} />

                  {/* 45 degree reflective surface blade */}
                  <g transform={`rotate(${angle})`}>
                    {/* Mirror back casing */}
                    <line x1={-18} y1={0} x2={18} y2={0} stroke="#334155" strokeWidth={6} strokeLinecap="round" />
                    {/* Mirror reflective front */}
                    <line x1={-18} y1={-1} x2={18} y2={-1} stroke="#00F0FF" strokeWidth={3} strokeLinecap="round" />
                  </g>
                </g>
              );
            }

            // Beam Splitter
            if (cell.type === 'splitter') {
              const angle = cell.orientation === '/' ? -45 : 45;

              return (
                <g
                  key={key}
                  transform={`translate(${cx}, ${cy})`}
                  className="cursor-pointer group"
                  onClick={() => handleCellClick(cell.row, cell.col)}
                >
                  <rect
                    x={-cellSize / 2 + 3}
                    y={-cellSize / 2 + 3}
                    width={cellSize - 6}
                    height={cellSize - 6}
                    rx={10}
                    fill="rgba(49, 10, 80, 0.6)"
                    stroke="rgba(236, 72, 153, 0.4)"
                    strokeWidth={1}
                    className="transition group-hover:stroke-pink-400 group-hover:fill-slate-900"
                  />
                  {/* Prismatic Splitter Diamond */}
                  <polygon
                    points="0,-18 18,0 0,18 -18,0"
                    fill="#1e1035"
                    stroke="#EC4899"
                    strokeWidth={2}
                  />
                  <g transform={`rotate(${angle})`}>
                    <line x1={-14} y1={0} x2={14} y2={0} stroke="#FFFFFF" strokeWidth={3} strokeDasharray="3 2" />
                  </g>
                </g>
              );
            }

            return null;
          })}
        </svg>
      </div>

      {/* Action Bar (Undo, Reset, Level Controls) */}
      <div className="w-full flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={history.length === 0 || isWon}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 disabled:opacity-40 transition"
            title="Undo Last Move (Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Undo</span>
          </button>
          <button
            onClick={handleReset}
            disabled={moves === 0}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 disabled:opacity-40 transition"
            title="Reset Level (R)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        <button
          onClick={() => {
            soundService.playClick();
            setShowLevelSelect(true);
          }}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition"
        >
          Select Level (1 - 15)
        </button>
      </div>

      {/* Victory Celebration Modal */}
      {isWon && (
        <div className="fixed inset-0 z-50 bg-[#07090e]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl p-6 glass-panel border border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.3)] text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_20px_rgba(16,185,129,0.5)]">
              <Sparkles className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-400">Target Illuminated</span>
              <h3 className="text-2xl font-black text-white mt-1">Level {levelId} Complete!</h3>
              <p className="text-xs text-slate-400 mt-0.5">{currentLevel.title}</p>
            </div>

            {/* Stars Awarded */}
            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3].map((starIdx) => (
                <Star
                  key={starIdx}
                  className={`w-8 h-8 transition-transform duration-300 ${
                    starIdx <= currentStars
                      ? 'text-amber-400 fill-amber-400 scale-110 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                      : 'text-slate-800'
                  }`}
                />
              ))}
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex justify-between">
              <span>Moves Taken: <strong className="text-white">{moves}</strong></span>
              <span>Goal: <strong className="text-emerald-400">≤{currentLevel.threeStarMoves}</strong></span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              {levelId < 15 ? (
                <button
                  onClick={() => loadLevel(levelId + 1)}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition flex items-center justify-center gap-2"
                >
                  Next Level <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => loadLevel(1)}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-purple-600 text-white hover:bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] transition"
                >
                  Replay Campaign
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Level Selection Modal */}
      {showLevelSelect && (
        <div className="fixed inset-0 z-50 bg-[#07090e]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl p-6 glass-panel border border-violet-500/40 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Select Optical Chamber</h3>
                <p className="text-xs text-slate-400">Choose any level from the 15 puzzle challenges.</p>
              </div>
              <button
                onClick={() => {
                  soundService.playClick();
                  setShowLevelSelect(false);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Level Grid Tiers */}
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {(['Beginner', 'Intermediate', 'Advanced'] as const).map((tierName) => {
                const tierLevels = LASER_LEVELS.filter((l) => l.tier === tierName);

                return (
                  <div key={tierName} className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-violet-400">
                      {tierName} (Levels {tierLevels[0].id} - {tierLevels[tierLevels.length - 1].id})
                    </h4>

                    <div className="grid grid-cols-5 gap-2">
                      {tierLevels.map((lvl) => {
                        const record = laserLab.levelRecords[lvl.id];
                        const isCurrent = lvl.id === levelId;

                        return (
                          <button
                            key={lvl.id}
                            onClick={() => loadLevel(lvl.id)}
                            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition ${
                              isCurrent
                                ? 'bg-violet-600 border-violet-400 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                                : record
                                ? 'bg-slate-900/90 border-cyan-500/40 text-cyan-300 hover:border-cyan-400'
                                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                            }`}
                          >
                            <span className="font-mono font-bold text-sm">{lvl.id}</span>
                            <div className="flex items-center gap-0.5">
                              {record ? (
                                Array.from({ length: record.stars }).map((_, s) => (
                                  <Star key={s} className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                                ))
                              ) : (
                                <span className="text-[9px] text-slate-600">•</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaserLabGame;
