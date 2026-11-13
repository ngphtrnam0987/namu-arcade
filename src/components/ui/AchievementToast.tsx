import React, { useEffect } from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { Trophy, X } from 'lucide-react';

export const AchievementToast: React.FC = () => {
  const toast = usePlayerStore((s) => s.toastAchievement);
  const dismiss = usePlayerStore((s) => s.dismissToast);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        dismiss();
      }, 5500);
      return () => clearTimeout(timer);
    }
  }, [toast, dismiss]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-300">
      <div className="flex items-center gap-4 p-4 rounded-xl border border-cyan-400/40 bg-slate-900/95 backdrop-blur-md shadow-[0_0_25px_rgba(0,240,255,0.3)] max-w-sm">
        <div
          className="p-3 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${toast.badgeColor}25`, border: `1px solid ${toast.badgeColor}` }}
        >
          <Trophy className="w-6 h-6" style={{ color: toast.badgeColor }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-bold text-cyan-400">Achievement Unlocked!</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-200 border border-purple-500/30">
              {toast.rarity}
            </span>
          </div>
          <h4 className="text-sm font-semibold text-white truncate mt-0.5">{toast.title}</h4>
          <p className="text-xs text-slate-400 line-clamp-1">{toast.description}</p>
        </div>
        <button
          onClick={dismiss}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
