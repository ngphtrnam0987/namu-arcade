import React from 'react';
import { Link } from 'react-router-dom';
import type { GameInfo } from '../../types/game';
import { Play, Flame, Brain, Trophy, Smartphone, Monitor } from 'lucide-react';
import { soundService } from '../../services/sound';
import { usePlayerStore } from '../../store/usePlayerStore';

interface GameCardProps {
  game: GameInfo;
  featured?: boolean;
}

export const GameCard: React.FC<GameCardProps> = ({ game, featured = false }) => {
  const gravityProgress = usePlayerStore((s) => s.gravityFlip);
  const laserProgress = usePlayerStore((s) => s.laserLab);

  let progressSnippet: React.ReactNode = null;
  if (game.id === 'gravity-flip') {
    progressSnippet = (
      <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
        <span className="flex items-center gap-1 text-cyan-400">
          <Trophy className="w-3.5 h-3.5" /> High Score: {gravityProgress.endlessHighScore}
        </span>
        <span>•</span>
        <span>Classic: Lvl {gravityProgress.classicCompletedLevels}/3</span>
      </div>
    );
  } else if (game.id === 'laser-lab') {
    progressSnippet = (
      <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
        <span className="flex items-center gap-1 text-violet-400">
          <Trophy className="w-3.5 h-3.5" /> Solved: {laserProgress.levelsCompleted}/15
        </span>
        <span>•</span>
        <span className="text-amber-400">★ {laserProgress.totalStars} Stars</span>
      </div>
    );
  }

  return (
    <div
      className={`group relative rounded-2xl overflow-hidden glass-panel glass-panel-hover flex flex-col transition-all duration-300 ${
        featured ? 'border-cyan-500/30' : 'border-slate-800'
      }`}
      style={{
        boxShadow: `0 10px 30px -15px ${game.accentColor.glow}`,
      }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        <img
          src={game.thumbnail}
          alt={game.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E17] via-transparent to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {game.badge && (
            <span
              className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-white shadow-md backdrop-blur-md"
              style={{ backgroundColor: `${game.accentColor.primary}cc` }}
            >
              {game.badge}
            </span>
          )}
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-900/80 text-slate-300 border border-slate-700 backdrop-blur-md flex items-center gap-1">
            {game.category === 'Arcade' ? <Flame className="w-3 h-3 text-cyan-400" /> : <Brain className="w-3 h-3 text-purple-400" />}
            {game.category}
          </span>
        </div>

        {/* Difficulty Pill */}
        <div className="absolute top-3 right-3">
          <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded-full bg-slate-900/90 text-slate-300 border border-slate-700/80">
            {game.difficulty}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
            {game.name}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {game.tagline}
          </p>

          {progressSnippet}

          {/* Controls hint */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5" title="Supports Desktop Keyboard & Mouse">
              <Monitor className="w-3.5 h-3.5 text-slate-400" />
              <span>Desktop</span>
            </div>
            <div className="flex items-center gap-1.5" title="Supports Touch Controls">
              <Smartphone className="w-3.5 h-3.5 text-slate-400" />
              <span>Mobile Touch</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-5">
          <Link
            to={game.route}
            onClick={() => soundService.playClick()}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200"
            style={{
              backgroundColor: game.accentColor.primary,
              color: '#07090e',
              boxShadow: `0 0 15px ${game.accentColor.glow}`,
            }}
          >
            <Play className="w-4 h-4 fill-current" />
            Play Now
          </Link>
        </div>
      </div>
    </div>
  );
};
