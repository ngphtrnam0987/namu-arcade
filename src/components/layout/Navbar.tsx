import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Volume2, VolumeX, Menu, X, Gamepad2, User, Settings, Sparkles } from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { soundService } from '../../services/sound';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isMuted, toggleMute } = useSettingsStore();

  const handleSoundToggle = () => {
    soundService.playClick();
    toggleMute();
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#07090e]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/"
          onClick={() => soundService.playClick()}
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-cyan-400/40 group-hover:border-cyan-400 transition shadow-[0_0_15px_rgba(0,240,255,0.25)]">
            <img src="/logo.svg" alt="NAMU ARCADE Logo" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-500">
                NAMU ARCADE
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-violet-950/80 text-violet-300 border border-violet-700/50">
                v1.0
              </span>
            </div>
            <span className="text-[10px] text-slate-400 tracking-wider">Your Little Universe of Games</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          <NavLink to="/" end className={navLinkClasses} onClick={() => soundService.playClick()}>
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Home
          </NavLink>
          <NavLink to="/games" className={navLinkClasses} onClick={() => soundService.playClick()}>
            <Gamepad2 className="w-4 h-4 text-violet-400" />
            Games
          </NavLink>
          <NavLink to="/profile" className={navLinkClasses} onClick={() => soundService.playClick()}>
            <User className="w-4 h-4 text-pink-400" />
            Profile
          </NavLink>
          <NavLink to="/settings" className={navLinkClasses} onClick={() => soundService.playClick()}>
            <Settings className="w-4 h-4 text-amber-400" />
            Settings
          </NavLink>
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSoundToggle}
            className={`p-2 rounded-lg border transition ${
              isMuted
                ? 'border-slate-700 bg-slate-900/60 text-slate-500 hover:text-slate-300'
                : 'border-cyan-500/40 bg-cyan-950/30 text-cyan-400 hover:bg-cyan-950/60 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
            }`}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => {
              soundService.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="md:hidden p-2 rounded-lg border border-slate-700 text-slate-300 hover:text-white"
            aria-label="Open Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#0c101c]/95 px-4 pt-2 pb-4 space-y-1">
          <NavLink
            to="/"
            end
            className={navLinkClasses}
            onClick={() => {
              soundService.playClick();
              setMobileMenuOpen(false);
            }}
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Home
          </NavLink>
          <NavLink
            to="/games"
            className={navLinkClasses}
            onClick={() => {
              soundService.playClick();
              setMobileMenuOpen(false);
            }}
          >
            <Gamepad2 className="w-4 h-4 text-violet-400" />
            Games
          </NavLink>
          <NavLink
            to="/profile"
            className={navLinkClasses}
            onClick={() => {
              soundService.playClick();
              setMobileMenuOpen(false);
            }}
          >
            <User className="w-4 h-4 text-pink-400" />
            Profile
          </NavLink>
          <NavLink
            to="/settings"
            className={navLinkClasses}
            onClick={() => {
              soundService.playClick();
              setMobileMenuOpen(false);
            }}
          >
            <Settings className="w-4 h-4 text-amber-400" />
            Settings
          </NavLink>
        </div>
      )}
    </header>
  );
};
