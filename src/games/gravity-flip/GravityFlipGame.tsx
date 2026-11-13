import React, { useRef, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { soundService } from '../../services/sound';
import {
  GAME_CONSTANTS,
  CLASSIC_LEVELS,
  createInitialPlayer,
  updatePlayerPhysics,
  flipPlayerGravity,
  checkCollision,
} from './engine/physics';
import { generateClassicObstacles, generateNextEndlessObstacle } from './engine/generator';
import type { Player, Obstacle, Particle, GravityGameMode, GravityGameStatus } from './engine/types';
import {
  Play,
  RotateCcw,
  Pause,
  Flame,
  Award,
  ArrowRight,
  Volume2,
  VolumeX,
} from 'lucide-react';

export const GravityFlipGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Zustand
  const { gravityFlip, recordGravityFlipRun } = usePlayerStore();
  const { isMuted, toggleMute } = useSettingsStore();

  // React states
  const [mode, setMode] = useState<GravityGameMode>('classic');
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [gameStatus, setGameStatus] = useState<GravityGameStatus>('idle');
  const [score, setScore] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);

  // Engine refs (for 60fps loop without state thrashing)
  const playerRef = useRef<Player>(createInitialPlayer());
  const obstaclesRef = useRef<Obstacle[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const cameraXRef = useRef<number>(0);
  const speedRef = useRef<number>(320);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const statusRef = useRef<GravityGameStatus>('idle');
  const scoreRef = useRef<number>(0);
  const distanceRef = useRef<number>(0);

  statusRef.current = gameStatus;

  // Spawn explosion particles
  const createExplosion = (x: number, y: number, color: string = '#00F0FF') => {
    const particles: Particle[] = [];
    const count = 30;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
      const spd = 60 + Math.random() * 280;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        size: 3 + Math.random() * 4,
        color: i % 2 === 0 ? color : '#EC4899',
        life: 0,
        maxLife: 0.6 + Math.random() * 0.4,
        alpha: 1,
      });
    }
    particlesRef.current.push(...particles);
  };

  // Start or Restart game
  const startGame = useCallback(
    (targetMode: GravityGameMode = mode, targetLvl: number = currentLevel) => {
      soundService.playClick();
      setMode(targetMode);
      setCurrentLevel(targetLvl);

      playerRef.current = createInitialPlayer();
      cameraXRef.current = 0;
      particlesRef.current = [];
      scoreRef.current = 0;
      distanceRef.current = 0;
      setScore(0);
      setDistance(0);

      if (targetMode === 'classic') {
        const lvlConfig = CLASSIC_LEVELS[targetLvl - 1] || CLASSIC_LEVELS[0];
        speedRef.current = lvlConfig.speed;
        obstaclesRef.current = generateClassicObstacles(targetLvl);
      } else {
        speedRef.current = 360;
        // Seed first 4 obstacles for endless
        const seeded: Obstacle[] = [];
        let lastX = 450;
        for (let i = 0; i < 4; i++) {
          const obs = generateNextEndlessObstacle(lastX, speedRef.current);
          seeded.push(obs);
          lastX = obs.x;
        }
        obstaclesRef.current = seeded;
      }

      setGameStatus('running');
      lastTimeRef.current = performance.now();
    },
    [mode, currentLevel]
  );

  // Invert Gravity
  const handleFlip = useCallback(() => {
    if (statusRef.current === 'running') {
      soundService.playFlip();
      flipPlayerGravity(playerRef.current);
    } else if (statusRef.current === 'idle') {
      startGame();
    }
  }, [startGame]);

  // Pause / Resume
  const togglePause = useCallback(() => {
    if (statusRef.current === 'running') {
      soundService.playClick();
      setGameStatus('paused');
    } else if (statusRef.current === 'paused') {
      soundService.playClick();
      setGameStatus('running');
      lastTimeRef.current = performance.now();
    }
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'KeyP') {
        e.preventDefault();
        togglePause();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        startGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip, togglePause, startGame]);

  // Main 60fps Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isMounted = true;

    const gameLoop = (time: number) => {
      if (!isMounted) return;

      if (!lastTimeRef.current) lastTimeRef.current = time;
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.05); // Clamp dt to prevent tunneling
      lastTimeRef.current = time;

      const player = playerRef.current;
      const currentStatus = statusRef.current;

      // 1. UPDATE GAME STATE IF RUNNING
      if (currentStatus === 'running') {
        // Forward progression
        const distStep = speedRef.current * dt;
        player.x += distStep;
        cameraXRef.current = player.x - 120;
        distanceRef.current += distStep / 10;
        setDistance(Math.floor(distanceRef.current));

        // Physics
        updatePlayerPhysics(player, dt);

        // Endless mode speed increase
        if (mode === 'endless') {
          speedRef.current = Math.min(650, 360 + distanceRef.current * 0.15);
        }

        // Obstacles check
        const obstacles = obstaclesRef.current;
        for (let i = 0; i < obstacles.length; i++) {
          const obs = obstacles[i];

          // Collision
          if (checkCollision(player, obs)) {
            soundService.playGameOver();
            createExplosion(player.x + player.width / 2, player.y + player.height / 2);
            setGameStatus('gameover');
            recordGravityFlipRun(mode, scoreRef.current);
            break;
          }

          // Passed obstacle scoring
          if (!obs.passed && player.x > obs.x + obs.width) {
            obs.passed = true;
            scoreRef.current += 10;
            setScore(scoreRef.current);
            soundService.playScorePoint();
          }
        }

        // Clean passed obstacles & spawn new in endless
        if (mode === 'endless') {
          // Remove obstacles far behind
          while (obstacles.length > 0 && obstacles[0].x < cameraXRef.current - 150) {
            obstacles.shift();
          }
          // Maintain at least 5 upcoming obstacles
          const lastObs = obstacles[obstacles.length - 1];
          const lastX = lastObs ? lastObs.x : player.x + 300;
          if (obstacles.length < 6) {
            const nextObs = generateNextEndlessObstacle(lastX, speedRef.current, lastObs?.type);
            obstacles.push(nextObs);
          }
        } else {
          // Classic Mode Win Condition
          const lvlConfig = CLASSIC_LEVELS[currentLevel - 1];
          if (distanceRef.current >= lvlConfig.targetDistance) {
            soundService.playVictory();
            try {
              confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
            } catch {}
            setGameStatus('victory');
            recordGravityFlipRun('classic', scoreRef.current, currentLevel);
          }
        }

        // Update particles
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i];
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.life += dt;
          p.alpha = 1 - p.life / p.maxLife;
          if (p.life >= p.maxLife) {
            particlesRef.current.splice(i, 1);
          }
        }
      }

      // 2. RENDER CANVAS
      const width = GAME_CONSTANTS.CANVAS_WIDTH;
      const height = GAME_CONSTANTS.CANVAS_HEIGHT;

      // Clear Screen with deep cosmic dark
      ctx.fillStyle = '#070A14';
      ctx.fillRect(0, 0, width, height);

      // Render Parallax Cyber Grid & Starfield
      ctx.save();
      const camX = cameraXRef.current;
      const gridOffset = camX % 40;

      // Vertical grid lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = -gridOffset; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, GAME_CONSTANTS.CEILING_Y);
        ctx.lineTo(x, GAME_CONSTANTS.FLOOR_Y);
        ctx.stroke();
      }

      // Rails (Floor & Ceiling with neon bloom)
      // Ceiling Rail
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, width, GAME_CONSTANTS.CEILING_Y);
      ctx.fillStyle = '#00F0FF';
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 12;
      ctx.fillRect(0, GAME_CONSTANTS.CEILING_Y - 4, width, 4);

      // Floor Rail
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, GAME_CONSTANTS.FLOOR_Y, width, height - GAME_CONSTANTS.FLOOR_Y);
      ctx.fillStyle = '#00F0FF';
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 12;
      ctx.fillRect(0, GAME_CONSTANTS.FLOOR_Y, width, 4);
      ctx.shadowBlur = 0;

      // Render Obstacles
      const obstacles = obstaclesRef.current;
      for (const obs of obstacles) {
        const screenX = obs.x - camX;
        if (screenX + obs.width < 0 || screenX > width) continue;

        ctx.save();
        if (obs.type === 'spike-bottom') {
          // Pink Glowing Spike pointing UP
          ctx.fillStyle = '#EC4899';
          ctx.shadowColor = '#EC4899';
          ctx.shadowBlur = 14;
          ctx.beginPath();
          ctx.moveTo(screenX, obs.y + obs.height);
          ctx.lineTo(screenX + obs.width / 2, obs.y);
          ctx.lineTo(screenX + obs.width, obs.y + obs.height);
          ctx.closePath();
          ctx.fill();
        } else if (obs.type === 'spike-top') {
          // Pink Glowing Spike pointing DOWN
          ctx.fillStyle = '#EC4899';
          ctx.shadowColor = '#EC4899';
          ctx.shadowBlur = 14;
          ctx.beginPath();
          ctx.moveTo(screenX, obs.y);
          ctx.lineTo(screenX + obs.width / 2, obs.y + obs.height);
          ctx.lineTo(screenX + obs.width, obs.y);
          ctx.closePath();
          ctx.fill();
        } else if (obs.type === 'barrier-middle') {
          // Electric Violet Energy Gate
          ctx.fillStyle = 'rgba(168, 85, 247, 0.4)';
          ctx.strokeStyle = '#A855F7';
          ctx.shadowColor = '#A855F7';
          ctx.shadowBlur = 12;
          ctx.lineWidth = 2;
          ctx.fillRect(screenX, obs.y, obs.width, obs.height);
          ctx.strokeRect(screenX, obs.y, obs.width, obs.height);

          // Diagonal hazard stripes
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(screenX, obs.y + 10);
          ctx.lineTo(screenX + obs.width, obs.y + 25);
          ctx.moveTo(screenX, obs.y + 40);
          ctx.lineTo(screenX + obs.width, obs.y + 55);
          ctx.stroke();
        } else {
          // Cyber crate blocks
          ctx.fillStyle = '#1E1B4B';
          ctx.strokeStyle = '#38BDF8';
          ctx.lineWidth = 2;
          ctx.fillRect(screenX, obs.y, obs.width, obs.height);
          ctx.strokeRect(screenX, obs.y, obs.width, obs.height);
        }
        ctx.restore();
      }

      // Render Player Thruster Trail
      for (const pt of player.trail) {
        const screenPtX = pt.x - camX;
        ctx.fillStyle = `rgba(0, 240, 255, ${Math.max(0, pt.alpha)})`;
        ctx.beginPath();
        ctx.arc(screenPtX, pt.y, pt.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render Player Cube
      if (currentStatus !== 'gameover') {
        const screenPlayerX = player.x - camX;
        ctx.save();
        ctx.translate(screenPlayerX + player.width / 2, player.y + player.height / 2);
        ctx.rotate(player.rotation);

        // Outer glow
        ctx.shadowColor = '#00F0FF';
        ctx.shadowBlur = 18;

        // Player body
        ctx.fillStyle = '#00F0FF';
        ctx.beginPath();
        ctx.roundRect(-player.width / 2, -player.height / 2, player.width, player.height, 6);
        ctx.fill();

        // Inner visor / eye
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#070A14';
        ctx.fillRect(-player.width / 2 + 6, -player.height / 2 + 6, player.width - 12, 10);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(player.width / 2 - 12, -player.height / 2 + 8, 4, 6);

        ctx.restore();
      }

      // Render Explosion Particles
      for (const p of particlesRef.current) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x - camX, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Classic Mode Target End Flag (if in viewport)
      if (mode === 'classic') {
        const targetDistPx = CLASSIC_LEVELS[currentLevel - 1].targetDistance * 10;
        const screenFlagX = targetDistPx - camX;
        if (screenFlagX > 0 && screenFlagX < width) {
          ctx.save();
          ctx.strokeStyle = '#10B981';
          ctx.shadowColor = '#10B981';
          ctx.shadowBlur = 15;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(screenFlagX, GAME_CONSTANTS.CEILING_Y);
          ctx.lineTo(screenFlagX, GAME_CONSTANTS.FLOOR_Y);
          ctx.stroke();
          ctx.fillStyle = '#10B981';
          ctx.font = 'bold 14px monospace';
          ctx.fillText('FINISH LINE', screenFlagX + 8, GAME_CONSTANTS.CEILING_Y + 30);
          ctx.restore();
        }
      }

      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      isMounted = false;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [mode, currentLevel, recordGravityFlipRun]);

  const targetDist = mode === 'classic' ? CLASSIC_LEVELS[currentLevel - 1].targetDistance : 0;
  const progressPercent = targetDist > 0 ? Math.min(100, Math.round((distance / targetDist) * 100)) : 0;

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto space-y-4">
      {/* Top HUD */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl glass-panel border border-slate-800">
        {/* Mode Selector */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (gameStatus !== 'running') {
                soundService.playClick();
                setMode('classic');
              }
            }}
            disabled={gameStatus === 'running'}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              mode === 'classic'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Classic Mode
          </button>
          <button
            onClick={() => {
              if (gameStatus !== 'running') {
                soundService.playClick();
                setMode('endless');
              }
            }}
            disabled={gameStatus === 'running'}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              mode === 'endless'
                ? 'bg-pink-500 text-white shadow-[0_0_12px_rgba(236,72,153,0.4)]'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Endless Runner
          </button>
        </div>

        {/* Level Switcher (Classic only) */}
        {mode === 'classic' && (
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400">Level:</span>
            {[1, 2, 3].map((lvl) => (
              <button
                key={lvl}
                disabled={gameStatus === 'running'}
                onClick={() => {
                  soundService.playClick();
                  setCurrentLevel(lvl);
                }}
                className={`w-7 h-7 rounded-lg font-mono font-bold transition ${
                  currentLevel === lvl
                    ? 'bg-cyan-400 text-slate-950 shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        )}

        {/* Stats & Actions */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-400">Score: </span>
            <span className="font-bold text-cyan-400">{score}</span>
          </div>
          <div>
            <span className="text-slate-400">Dist: </span>
            <span className="font-bold text-white">{distance}m</span>
          </div>
          {mode === 'endless' && (
            <div className="hidden sm:block">
              <span className="text-slate-400">Best: </span>
              <span className="font-bold text-pink-400">{gravityFlip.endlessHighScore}</span>
            </div>
          )}
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

      {/* Classic Progress Bar */}
      {mode === 'classic' && (
        <div className="w-full space-y-1">
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>
              Lvl {currentLevel}: {CLASSIC_LEVELS[currentLevel - 1].name}
            </span>
            <span className="text-cyan-400 font-bold">
              {distance} / {targetDist}m ({progressPercent}%)
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-200"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Game Canvas Container */}
      <div
        className="relative w-full aspect-[16/9] max-h-[500px] rounded-2xl overflow-hidden border-2 border-cyan-500/40 shadow-[0_0_30px_rgba(0,240,255,0.15)] bg-[#070A14] select-none cursor-pointer"
        onClick={handleFlip}
      >
        <canvas
          ref={canvasRef}
          width={GAME_CONSTANTS.CANVAS_WIDTH}
          height={GAME_CONSTANTS.CANVAS_HEIGHT}
          className="w-full h-full block"
        />

        {/* Start / Idle Screen */}
        {gameStatus === 'idle' && (
          <div className="absolute inset-0 bg-[#070A14]/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.4)] animate-bounce">
              <Play className="w-8 h-8 fill-current ml-1" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">GRAVITY FLIP</h2>
              <p className="text-xs sm:text-sm text-cyan-300/80 mt-1">
                {mode === 'classic'
                  ? `Level ${currentLevel} — Reach ${CLASSIC_LEVELS[currentLevel - 1].targetDistance}m to win`
                  : 'Endless Mode — Dodge hazards and survive for maximum score'}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                startGame();
              }}
              className="px-6 py-2.5 rounded-xl font-bold text-sm bg-cyan-400 text-slate-950 hover:bg-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.5)] transition"
            >
              Start Game (Space / Click)
            </button>
            <p className="text-[11px] font-mono text-slate-400">
              Desktop: Space to Flip • P to Pause | Mobile: Tap anywhere
            </p>
          </div>
        )}

        {/* Paused Overlay */}
        {gameStatus === 'paused' && (
          <div className="absolute inset-0 bg-[#070A14]/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 space-y-4">
            <h3 className="text-2xl font-black text-cyan-400">PAUSED</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePause();
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition"
              >
                Resume Run
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startGame();
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
              >
                Restart (R)
              </button>
            </div>
          </div>
        )}

        {/* Game Over Screen */}
        {gameStatus === 'gameover' && (
          <div className="absolute inset-0 bg-red-950/80 backdrop-blur-md flex flex-col items-center justify-center p-6 space-y-4 animate-in fade-in">
            <h3 className="text-3xl font-black text-red-400 tracking-wider">CRASH DETECTED</h3>
            <div className="p-4 rounded-xl bg-slate-900/90 border border-red-500/40 text-center min-w-56 space-y-1">
              <p className="text-xs text-slate-400">Final Distance</p>
              <p className="text-2xl font-bold text-white">{distance}m</p>
              <p className="text-xs text-pink-400 font-mono pt-1">Score: +{score} pts</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                startGame();
              }}
              className="px-6 py-2.5 rounded-xl font-bold text-sm bg-red-500 text-white hover:bg-red-400 shadow-[0_0_20px_rgba(239,68,68,0.5)] transition flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Try Again (R)
            </button>
          </div>
        )}

        {/* Victory Screen (Classic Mode) */}
        {gameStatus === 'victory' && (
          <div className="absolute inset-0 bg-[#070A14]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-950 border border-amber-400 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)]">
              <Award className="w-8 h-8" />
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-black text-white">LEVEL {currentLevel} CLEARED!</h3>
              <p className="text-xs text-emerald-400 font-mono mt-1">Distance requirement accomplished</p>
            </div>

            <div className="flex items-center gap-3">
              {currentLevel < 3 ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startGame('classic', currentLevel + 1);
                  }}
                  className="px-6 py-2.5 rounded-xl font-bold text-sm bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition flex items-center gap-2"
                >
                  Next Level ({currentLevel + 1}) <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startGame('endless', 1);
                  }}
                  className="px-6 py-2.5 rounded-xl font-bold text-sm bg-pink-500 text-white hover:bg-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.5)] transition flex items-center gap-2"
                >
                  <Flame className="w-4 h-4" /> Play Endless Mode
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startGame('classic', currentLevel);
                }}
                className="px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
              >
                Replay Level
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Dedicated Touch Controls for Mobile & Quick Desktop Buttons */}
      <div className="w-full flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={togglePause}
            disabled={gameStatus === 'idle'}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 disabled:opacity-40"
          >
            <Pause className="w-3.5 h-3.5" />
            <span>{gameStatus === 'paused' ? 'Resume' : 'Pause'}</span>
          </button>
          <button
            onClick={() => startGame()}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart</span>
          </button>
        </div>

        {/* Large Mobile Tap Button */}
        <button
          onClick={handleFlip}
          className="flex-1 max-w-xs sm:hidden py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-violet-600 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.3)] active:scale-95 transition"
        >
          TAP TO FLIP GRAVITY
        </button>

        <div className="text-right text-[11px] font-mono text-slate-500 hidden sm:block">
          60 FPS Engine • Subpixel Collision
        </div>
      </div>
    </div>
  );
};

export default GravityFlipGame;
