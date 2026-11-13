import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Zap } from 'lucide-react';
import { soundService } from '../../services/sound';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#06080e] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="NAMU ARCADE" className="w-8 h-8 rounded-lg" />
              <span className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-500">
                NAMU ARCADE
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Your Little Universe of Games. Fast, responsive, pure HTML5 indie mini-games designed for high replayability, instant loading, and zero intrusive ads.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Client Engine Online • Zero Latency
            </div>
          </div>

          {/* Featured Games */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-300 mb-3 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-cyan-400" /> Games
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/games/gravity-flip"
                  onClick={() => soundService.playClick()}
                  className="text-slate-400 hover:text-cyan-400 transition"
                >
                  Gravity Flip
                </Link>
              </li>
              <li>
                <Link
                  to="/games/laser-lab"
                  onClick={() => soundService.playClick()}
                  className="text-slate-400 hover:text-violet-400 transition"
                >
                  Laser Lab
                </Link>
              </li>
              <li>
                <Link
                  to="/games"
                  onClick={() => soundService.playClick()}
                  className="text-slate-400 hover:text-white transition"
                >
                  All Games
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-300 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-pink-400" /> Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/profile"
                  onClick={() => soundService.playClick()}
                  className="text-slate-400 hover:text-pink-400 transition"
                >
                  Player Profile & Achievements
                </Link>
              </li>
              <li>
                <Link
                  to="/settings"
                  onClick={() => soundService.playClick()}
                  className="text-slate-400 hover:text-amber-400 transition"
                >
                  Audio & Motion Settings
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>GitHub Repository</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/60 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} NAMU ARCADE. Built with React, TypeScript & Web Audio.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" /> for instant browser gameplay
          </p>
        </div>
      </div>
    </footer>
  );
};
