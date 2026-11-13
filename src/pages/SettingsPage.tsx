import React, { useState } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { soundService } from '../services/sound';
import {
  Settings,
  Volume2,
  VolumeX,
  Keyboard,
  RotateCcw,
  AlertTriangle,
  Check,
  Eye,
  Sliders,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { volume, isMuted, reducedMotion, setVolume, toggleMute, setReducedMotion, resetSettings } =
    useSettingsStore();
  const resetPlayerProgress = usePlayerStore((s) => s.resetAllProgress);

  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    soundService.playClick();
  };

  const handleMuteToggle = () => {
    soundService.playClick();
    toggleMute();
  };

  const handleReducedMotionToggle = () => {
    soundService.playClick();
    setReducedMotion(!reducedMotion);
  };

  const handleExecuteReset = () => {
    soundService.playGameOver();
    resetPlayerProgress();
    resetSettings();
    setShowConfirmReset(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Settings className="w-4 h-4" />
          <span>System Preferences</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Settings</h1>
        <p className="text-sm text-slate-400 mt-1">
          Adjust audio synthesis, motion controls, and inspect gameplay shortcut reference.
        </p>
      </div>

      {resetSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-sm flex items-center gap-2">
          <Check className="w-5 h-5 text-emerald-400" />
          <span>All arcade scores, achievements, and settings have been reset.</span>
        </div>
      )}

      {/* Audio Panel */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Synthesized Audio Engine</h3>
            <p className="text-xs text-slate-400">
              Control master output volume of synthesized sound effects.
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {/* Mute Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-3">
              {isMuted ? <VolumeX className="w-5 h-5 text-slate-500" /> : <Volume2 className="w-5 h-5 text-cyan-400" />}
              <div>
                <h4 className="text-sm font-semibold text-white">Master Sound</h4>
                <p className="text-xs text-slate-400">Enable or disable all in-game sound fx</p>
              </div>
            </div>
            <button
              onClick={handleMuteToggle}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                isMuted
                  ? 'bg-slate-800 text-slate-400 border border-slate-700'
                  : 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
              }`}
            >
              {isMuted ? 'Muted' : 'Sound ON'}
            </button>
          </div>

          {/* Volume Slider */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-semibold">Master Volume Level</span>
              <span className="font-mono text-cyan-400">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              disabled={isMuted}
              onChange={handleVolumeChange}
              className="w-full accent-cyan-400 cursor-pointer disabled:opacity-40"
            />
          </div>
        </div>
      </div>

      {/* Visual & Accessibility */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-purple-950/80 text-purple-400 border border-purple-800/60">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Accessibility & Visuals</h3>
            <p className="text-xs text-slate-400">
              Customize motion and transition intensities.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <div>
            <h4 className="text-sm font-semibold text-white">Reduced Motion</h4>
            <p className="text-xs text-slate-400">Disables intense flashing effects and fast transitions</p>
          </div>
          <button
            onClick={handleReducedMotionToggle}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              reducedMotion
                ? 'bg-purple-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            {reducedMotion ? 'Enabled' : 'Default'}
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts Reference */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-pink-950/80 text-pink-400 border border-pink-800/60">
            <Keyboard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Keyboard Shortcuts & Controls</h3>
            <p className="text-xs text-slate-400">Supported desktop and mobile interactions.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">Gravity Flip</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Flip Gravity</span>
                <span className="font-mono text-white bg-slate-800 px-2 py-0.5 rounded">Space / Click / Tap</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Pause / Resume</span>
                <span className="font-mono text-white bg-slate-800 px-2 py-0.5 rounded">P / Pause Button</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Restart Run</span>
                <span className="font-mono text-white bg-slate-800 px-2 py-0.5 rounded">R / Restart Button</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-violet-400">Laser Lab</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Rotate Mirror 90°</span>
                <span className="font-mono text-white bg-slate-800 px-2 py-0.5 rounded">Click / Tap Mirror</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Undo Move</span>
                <span className="font-mono text-white bg-slate-800 px-2 py-0.5 rounded">Z / Ctrl+Z / Button</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Reset Level</span>
                <span className="font-mono text-white bg-slate-800 px-2 py-0.5 rounded">R / Reset Button</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone: Reset Progress */}
      <div className="p-6 rounded-2xl glass-panel border border-red-900/40 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-red-950/80 text-red-400 border border-red-800/60">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Reset Local Data</h3>
            <p className="text-xs text-slate-400">
              Clear your high scores, level completions, and achievements.
            </p>
          </div>
        </div>

        {showConfirmReset ? (
          <div className="p-4 rounded-xl bg-red-950/60 border border-red-600/60 space-y-3">
            <p className="text-xs text-red-200">
              Are you sure? This action cannot be undone. All personal records and trophies will be erased from localStorage.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExecuteReset}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-500 text-white transition shadow-[0_0_15px_rgba(239,68,68,0.4)]"
              >
                Yes, Reset Everything
              </button>
              <button
                onClick={() => {
                  soundService.playClick();
                  setShowConfirmReset(false);
                }}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              soundService.playClick();
              setShowConfirmReset(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-red-950/80 text-red-400 hover:bg-red-900/60 border border-red-800/60 transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All Progress</span>
          </button>
        )}
      </div>
    </div>
  );
};
