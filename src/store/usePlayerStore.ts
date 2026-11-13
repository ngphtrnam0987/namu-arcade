import { create } from 'zustand';
import { ACHIEVEMENTS_LIST, type Achievement } from '../types/achievements';
import { soundService } from '../services/sound';

interface LevelRecord {
  stars: number;
  moves: number;
  completedAt: string;
}

interface PlayerState {
  nickname: string;
  totalGamesPlayed: number;
  totalSessions: number;
  gravityFlip: {
    classicCompletedLevels: number;
    endlessHighScore: number;
    totalRuns: number;
  };
  laserLab: {
    levelsCompleted: number;
    totalStars: number;
    levelRecords: Record<number, LevelRecord>;
  };
  unlockedAchievements: Record<string, { unlocked: boolean; unlockedAt: string }>;
  toastAchievement: Achievement | null;

  // Actions
  setNickname: (name: string) => void;
  recordGameStart: (gameId: 'gravity-flip' | 'laser-lab') => void;
  recordGravityFlipRun: (mode: 'classic' | 'endless', score: number, levelWon?: number) => void;
  recordLaserLevelSolve: (levelId: number, stars: number, moves: number) => void;
  unlockAchievement: (id: string) => void;
  dismissToast: () => void;
  resetAllProgress: () => void;
}

const STORAGE_KEY = 'namu_arcade_player_v1';

const getInitialPlayerState = () => {
  const fallback = {
    nickname: 'ArcadePilot',
    totalGamesPlayed: 0,
    totalSessions: 1,
    gravityFlip: {
      classicCompletedLevels: 0,
      endlessHighScore: 0,
      totalRuns: 0,
    },
    laserLab: {
      levelsCompleted: 0,
      totalStars: 0,
      levelRecords: {} as Record<number, LevelRecord>,
    },
    unlockedAchievements: {} as Record<string, { unlocked: boolean; unlockedAt: string }>,
  };

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...fallback,
          ...parsed,
          totalSessions: (parsed.totalSessions || 0) + 1,
        };
      }
    }
  } catch (e) {
    // ignore in environments without localStorage
  }
  return fallback;
};

const initial = getInitialPlayerState();

export const usePlayerStore = create<PlayerState>((set, get) => {
  const save = (state: Partial<PlayerState>) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const current = { ...get(), ...state };
        const toSave = {
          nickname: current.nickname,
          totalGamesPlayed: current.totalGamesPlayed,
          totalSessions: current.totalSessions,
          gravityFlip: current.gravityFlip,
          laserLab: current.laserLab,
          unlockedAchievements: current.unlockedAchievements,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      }
    } catch (e) {
      // ignore
    }
  };

  const triggerUnlock = (id: string) => {
    const ach = ACHIEVEMENTS_LIST.find((a) => a.id === id);
    if (!ach) return;

    const state = get();
    if (state.unlockedAchievements[id]?.unlocked) return;

    const now = new Date().toISOString();
    const updated = {
      ...state.unlockedAchievements,
      [id]: { unlocked: true, unlockedAt: now },
    };

    soundService.playAchievement();
    set({
      unlockedAchievements: updated,
      toastAchievement: ach,
    });
    save({ unlockedAchievements: updated });
  };

  return {
    nickname: initial.nickname,
    totalGamesPlayed: initial.totalGamesPlayed,
    totalSessions: initial.totalSessions,
    gravityFlip: initial.gravityFlip,
    laserLab: initial.laserLab,
    unlockedAchievements: initial.unlockedAchievements,
    toastAchievement: null,

    setNickname: (name: string) => {
      const clean = name.trim().slice(0, 20) || 'ArcadePilot';
      set({ nickname: clean });
      save({ nickname: clean });
    },

    recordGameStart: (_gameId: 'gravity-flip' | 'laser-lab') => {
      const nextGamesPlayed = get().totalGamesPlayed + 1;
      set({ totalGamesPlayed: nextGamesPlayed });
      save({ totalGamesPlayed: nextGamesPlayed });

      // First play achievement
      triggerUnlock('first-play');

      // Marathon achievement
      if (nextGamesPlayed >= 10) {
        triggerUnlock('neon-marathon');
      }
    },

    recordGravityFlipRun: (mode: 'classic' | 'endless', score: number, levelWon?: number) => {
      const state = get();
      const currentGf = state.gravityFlip;
      const nextRuns = currentGf.totalRuns + 1;

      let nextClassicCompleted = currentGf.classicCompletedLevels;
      if (mode === 'classic' && levelWon && levelWon > nextClassicCompleted) {
        nextClassicCompleted = levelWon;
      }

      let nextHighScore = currentGf.endlessHighScore;
      if (mode === 'endless' && score > nextHighScore) {
        nextHighScore = score;
      }

      const updatedGf = {
        classicCompletedLevels: nextClassicCompleted,
        endlessHighScore: nextHighScore,
        totalRuns: nextRuns,
      };

      set({ gravityFlip: updatedGf });
      save({ gravityFlip: updatedGf });

      // Check achievements
      if (nextClassicCompleted >= 1) {
        triggerUnlock('gravity-rookie');
      }
      if (nextClassicCompleted >= 3) {
        triggerUnlock('gravity-master');
      }
      if (nextHighScore >= 50) {
        triggerUnlock('survivor');
      }
    },

    recordLaserLevelSolve: (levelId: number, stars: number, moves: number) => {
      const state = get();
      const currentRecords = { ...state.laserLab.levelRecords };
      const previous = currentRecords[levelId];

      const bestStars = previous ? Math.max(previous.stars, stars) : stars;
      const bestMoves = previous ? Math.min(previous.moves, moves) : moves;

      currentRecords[levelId] = {
        stars: bestStars,
        moves: bestMoves,
        completedAt: new Date().toISOString(),
      };

      const completedCount = Object.keys(currentRecords).length;
      let totalStars = 0;
      Object.values(currentRecords).forEach((rec) => {
        totalStars += rec.stars;
      });

      const updatedLaser = {
        levelsCompleted: completedCount,
        totalStars,
        levelRecords: currentRecords,
      };

      set({ laserLab: updatedLaser });
      save({ laserLab: updatedLaser });

      // Achievements
      triggerUnlock('puzzle-starter');

      if (stars === 3) {
        triggerUnlock('refraction-star');
      }

      if (completedCount >= 15) {
        triggerUnlock('laser-expert');
      }
    },

    unlockAchievement: (id: string) => {
      triggerUnlock(id);
    },

    dismissToast: () => {
      set({ toastAchievement: null });
    },

    resetAllProgress: () => {
      const resetState = {
        nickname: 'ArcadePilot',
        totalGamesPlayed: 0,
        totalSessions: 1,
        gravityFlip: {
          classicCompletedLevels: 0,
          endlessHighScore: 0,
          totalRuns: 0,
        },
        laserLab: {
          levelsCompleted: 0,
          totalStars: 0,
          levelRecords: {},
        },
        unlockedAchievements: {},
        toastAchievement: null,
      };
      set(resetState);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    },
  };
});
