import React, { Suspense, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getGameById } from '../games/registry';
import { usePlayerStore } from '../store/usePlayerStore';
import { soundService } from '../services/sound';
import { ArrowLeft, Loader2, Info } from 'lucide-react';

export const GameViewPage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const game = getGameById(gameId || '');
  const recordGameStart = usePlayerStore((s) => s.recordGameStart);

  useEffect(() => {
    if (game && (game.id === 'gravity-flip' || game.id === 'laser-lab')) {
      recordGameStart(game.id as 'gravity-flip' | 'laser-lab');
    }
  }, [game, recordGameStart]);

  if (!game) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-red-400">Game Not Found</h2>
        <p className="text-slate-400 text-sm">The game you are looking for does not exist in the arcade registry.</p>
        <Link
          to="/games"
          onClick={() => soundService.playClick()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Library
        </Link>
      </div>
    );
  }

  const GameComponent = game.component;

  return (
    <div className="flex-1 flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 w-full">
      {/* Top Bar Navigation & Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            to="/games"
            onClick={() => soundService.playClick()}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-cyan-500/50 transition"
            title="Back to Game Library"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">{game.name}</h1>
              {game.badge && (
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: `${game.accentColor.primary}dd` }}
                >
                  {game.badge}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">{game.tagline}</p>
          </div>
        </div>

        {/* Quick controls pill */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline">{game.supportedControls.desktop[0]}</span>
          <span className="md:hidden">{game.supportedControls.mobile[0]}</span>
        </div>
      </div>

      {/* Main Game Frame */}
      <div className="flex-1 flex flex-col justify-center items-center w-full min-h-[500px]">
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
              <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
              <p className="text-sm font-mono text-slate-400">Initializing arcade module...</p>
            </div>
          }
        >
          <GameComponent />
        </Suspense>
      </div>
    </div>
  );
};
