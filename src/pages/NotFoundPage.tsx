import React from 'react';
import { Link } from 'react-router-dom';
import { soundService } from '../services/sound';
import { Gamepad2, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
      <div className="p-4 rounded-3xl bg-slate-900 border border-cyan-500/30 text-cyan-400">
        <Gamepad2 className="w-16 h-16 animate-pulse" />
      </div>
      <div>
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
          404
        </h1>
        <h2 className="text-xl font-bold text-white mt-2">Coordinates Out of Bounds</h2>
        <p className="text-sm text-slate-400 max-w-sm mx-auto mt-1">
          This portal does not lead to any known mini-game galaxy.
        </p>
      </div>

      <Link
        to="/"
        onClick={() => soundService.playClick()}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-sm shadow-[0_0_15px_rgba(0,240,255,0.4)] transition"
      >
        <Home className="w-4 h-4" />
        Return to Arcade Hub
      </Link>
    </div>
  );
};
