import React, { useState } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { ACHIEVEMENTS_LIST } from '../types/achievements';
import { soundService } from '../services/sound';
import {
  User,
  Trophy,
  Award,
  Gamepad2,
  CheckCircle2,
  Lock,
  Edit2,
  Check,
  Flame,
  Zap,
  Star,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const {
    nickname,
    setNickname,
    totalGamesPlayed,
    totalSessions,
    gravityFlip,
    laserLab,
    unlockedAchievements,
  } = usePlayerStore();

  const [isEditingNick, setIsEditingNick] = useState(false);
  const [nickInput, setNickInput] = useState(nickname);

  const handleSaveNick = () => {
    soundService.playClick();
    setNickname(nickInput);
    setIsEditingNick(false);
  };

  const unlockedCount = Object.keys(unlockedAchievements).length;
  const progressPercent = Math.round((unlockedCount / ACHIEVEMENTS_LIST.length) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
      {/* Pilot Profile Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 glass-panel border border-cyan-500/30 overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          {/* Avatar Icon */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 to-violet-600 p-0.5 shadow-[0_0_20px_rgba(0,240,255,0.35)] shrink-0">
            <div className="w-full h-full bg-[#0d1222] rounded-[14px] flex items-center justify-center">
              <User className="w-10 h-10 text-cyan-400" />
            </div>
          </div>

          {/* Nickname & General Info */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              {isEditingNick ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nickInput}
                    onChange={(e) => setNickInput(e.target.value)}
                    maxLength={20}
                    className="px-3 py-1 rounded-lg bg-slate-900 border border-cyan-400 text-white font-bold text-xl focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveNick}
                    className="p-1.5 rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition"
                    title="Save Nickname"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-white">{nickname}</h1>
                  <button
                    onClick={() => {
                      soundService.playClick();
                      setIsEditingNick(true);
                    }}
                    className="p-1 rounded text-slate-400 hover:text-cyan-400 transition"
                    title="Edit Nickname"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/50 font-mono">
                Arcade Pilot
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Personal gaming passport stored safely in your browser. No account needed.
            </p>
          </div>

          {/* Overall Stats Pills */}
          <div className="flex items-center gap-4 text-center">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 min-w-20">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Runs</span>
              <p className="text-lg font-bold text-white mt-0.5">{totalGamesPlayed}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 min-w-20">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Sessions</span>
              <p className="text-lg font-bold text-cyan-400 mt-0.5">{totalSessions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Game Performance Cards */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-cyan-400" />
          <span>Game Performance & Personal Records</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gravity Flip Card */}
          <div className="p-6 rounded-2xl glass-panel border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Gravity Flip</h3>
                  <span className="text-xs text-slate-400">2D Precision Runner</span>
                </div>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                {gravityFlip.totalRuns} Runs
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                <span className="text-xs text-slate-400">Endless High Score</span>
                <p className="text-xl font-bold text-pink-400 mt-1">{gravityFlip.endlessHighScore} pts</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                <span className="text-xs text-slate-400">Classic Levels Cleared</span>
                <p className="text-xl font-bold text-cyan-400 mt-1">
                  {gravityFlip.classicCompletedLevels} / 3
                </p>
              </div>
            </div>
          </div>

          {/* Laser Lab Card */}
          <div className="p-6 rounded-2xl glass-panel border border-violet-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-violet-950/80 text-violet-400 border border-violet-800/60">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Laser Lab</h3>
                  <span className="text-xs text-slate-400">Optics Matrix Puzzle</span>
                </div>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                15 Levels
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                <span className="text-xs text-slate-400">Puzzles Solved</span>
                <p className="text-xl font-bold text-violet-400 mt-1">
                  {laserLab.levelsCompleted} / 15
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                <span className="text-xs text-slate-400">Total Stars Earned</span>
                <p className="text-xl font-bold text-amber-400 mt-1 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{laserLab.totalStars} / 45</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Trophy Case</span>
              <span className="text-sm font-normal text-slate-400">
                ({unlockedCount} / {ACHIEVEMENTS_LIST.length} unlocked)
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Achievements are unlocked through genuine gameplay events and stored across sessions.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full sm:w-48 space-y-1">
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>Completion</span>
              <span className="text-cyan-400 font-bold">{progressPercent}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Achievement Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACHIEVEMENTS_LIST.map((ach) => {
            const isUnlocked = !!unlockedAchievements[ach.id]?.unlocked;
            const unlockedDate = unlockedAchievements[ach.id]?.unlockedAt;

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-xl border transition-all duration-200 flex items-start gap-4 ${
                  isUnlocked
                    ? 'bg-slate-900/80 border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.1)]'
                    : 'bg-slate-950/40 border-slate-800/80 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                    isUnlocked
                      ? 'border-cyan-400/50 bg-cyan-950/60 text-cyan-300'
                      : 'border-slate-800 bg-slate-900 text-slate-600'
                  }`}
                  style={isUnlocked ? { boxShadow: `0 0 10px ${ach.badgeColor}40` } : undefined}
                >
                  {isUnlocked ? <Trophy className="w-6 h-6" style={{ color: ach.badgeColor }} /> : <Lock className="w-5 h-5" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-white truncate">{ach.title}</h4>
                    <span
                      className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border"
                      style={{
                        color: isUnlocked ? ach.badgeColor : '#64748B',
                        borderColor: isUnlocked ? `${ach.badgeColor}50` : '#334155',
                        backgroundColor: isUnlocked ? `${ach.badgeColor}15` : '#1E293B',
                      }}
                    >
                      {ach.rarity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{ach.description}</p>
                  <div className="mt-2 text-[10px] font-mono text-slate-500 flex items-center gap-1">
                    {isUnlocked ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Unlocked {new Date(unlockedDate).toLocaleDateString()}</span>
                      </>
                    ) : (
                      <span>Locked</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
