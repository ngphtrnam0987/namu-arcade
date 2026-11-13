import React from 'react';
import { Link } from 'react-router-dom';
import { GAMES_REGISTRY } from '../games/registry';
import { GameCard } from '../components/ui/GameCard';
import { usePlayerStore } from '../store/usePlayerStore';
import { soundService } from '../services/sound';
import { Sparkles, Trophy, Flame, Play, Cpu } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { nickname, totalGamesPlayed, gravityFlip, laserLab, unlockedAchievements } = usePlayerStore();
  const achievementsCount = Object.keys(unlockedAchievements).length;

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-12 border-b border-slate-800/60">
        {/* Glow ambient background elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-cyan-600/20 via-purple-600/20 to-pink-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-cyan-950/70 text-cyan-300 border border-cyan-500/30 mb-6 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>INSTANT WEB ARCADE • ZERO DOWNLOADS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-none">
            NAMU{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-500">
              ARCADE
            </span>
          </h1>

          <p className="mt-4 text-xl sm:text-2xl text-cyan-200/80 font-medium tracking-wide">
            Your Little Universe of Games
          </p>

          <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Step into a neon cosmos of handcrafted browser mini-games. Defy physics in high-speed gravity runners or master optical puzzles with laser refraction.
          </p>

          {/* Quick Action CTA buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/games/gravity-flip"
              onClick={() => soundService.playClick()}
              className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 hover:brightness-110 shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center gap-2 transition"
            >
              <Play className="w-4 h-4 fill-current" />
              Play Gravity Flip
            </Link>
            <Link
              to="/games/laser-lab"
              onClick={() => soundService.playClick()}
              className="px-6 py-3 rounded-xl font-bold text-sm bg-purple-950/80 text-purple-200 border border-purple-500/40 hover:bg-purple-900/60 shadow-[0_0_20px_rgba(168,85,247,0.25)] flex items-center gap-2 transition"
            >
              <Cpu className="w-4 h-4 text-purple-400" />
              Solve Laser Lab
            </Link>
          </div>

          {/* Player Live Stats Ribbon */}
          <div className="mt-12 max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-2xl glass-panel border border-slate-800">
            <div className="p-2 text-center">
              <span className="text-xs text-slate-400">Pilot</span>
              <p className="text-sm font-bold text-cyan-400 truncate mt-0.5">{nickname}</p>
            </div>
            <div className="p-2 text-center border-l border-slate-800/80">
              <span className="text-xs text-slate-400">Games Played</span>
              <p className="text-sm font-bold text-white mt-0.5">{totalGamesPlayed}</p>
            </div>
            <div className="p-2 text-center border-l border-slate-800/80">
              <span className="text-xs text-slate-400">Endless High</span>
              <p className="text-sm font-bold text-pink-400 mt-0.5">{gravityFlip.endlessHighScore} pts</p>
            </div>
            <div className="p-2 text-center border-l border-slate-800/80">
              <span className="text-xs text-slate-400">Puzzles Solved</span>
              <p className="text-sm font-bold text-violet-400 mt-0.5">{laserLab.levelsCompleted}/15</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Games Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Flame className="w-4 h-4" />
              <span>Curated Titles</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">Featured Games</h2>
          </div>
          <Link
            to="/games"
            onClick={() => soundService.playClick()}
            className="text-xs font-semibold text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition"
          >
            <span>View All</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {GAMES_REGISTRY.map((game) => (
            <GameCard key={game.id} game={game} featured={true} />
          ))}
        </div>
      </section>

      {/* Arcade Hall of Fame & Badges Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-3xl p-8 glass-panel border border-violet-500/30 relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase text-violet-300 bg-violet-950/60 px-3 py-1 rounded-full border border-violet-600/30">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Achievements & Progress Tracking</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Unlock Real Arcade Trophies</h3>
              <p className="text-sm text-slate-400 max-w-xl">
                Every victory, high score, and puzzle solved earns permanent badges saved in your browser. You currently hold <span className="text-cyan-400 font-bold">{achievementsCount}</span> unlocked achievements.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/profile"
                onClick={() => soundService.playClick()}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white transition shadow-[0_0_15px_rgba(168,85,247,0.4)]"
              >
                View Trophy Room
              </Link>
              <Link
                to="/settings"
                onClick={() => soundService.playClick()}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
              >
                Configure Audio
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
