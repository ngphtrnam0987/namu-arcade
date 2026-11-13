import { describe, it, expect, beforeEach } from 'vitest';
import { usePlayerStore } from '../store/usePlayerStore';
import { useSettingsStore } from '../store/useSettingsStore';

describe('Player and Settings Stores', () => {
  beforeEach(() => {
    usePlayerStore.getState().resetAllProgress();
    useSettingsStore.getState().resetSettings();
  });

  it('updates pilot nickname', () => {
    const store = usePlayerStore.getState();
    store.setNickname('StarPilot99');
    expect(usePlayerStore.getState().nickname).toBe('StarPilot99');
  });

  it('unlocks first-play achievement on first game run', () => {
    const store = usePlayerStore.getState();
    expect(store.unlockedAchievements['first-play']).toBeUndefined();

    store.recordGameStart('gravity-flip');
    const updated = usePlayerStore.getState();
    expect(updated.totalGamesPlayed).toBe(1);
    expect(updated.unlockedAchievements['first-play']?.unlocked).toBe(true);
  });

  it('unlocks gravity achievements based on classic levels and endless high score', () => {
    const store = usePlayerStore.getState();

    // Complete Level 1
    store.recordGravityFlipRun('classic', 40, 1);
    expect(usePlayerStore.getState().unlockedAchievements['gravity-rookie']?.unlocked).toBe(true);

    // Complete Level 3
    store.recordGravityFlipRun('classic', 120, 3);
    expect(usePlayerStore.getState().unlockedAchievements['gravity-master']?.unlocked).toBe(true);

    // Score 60 in endless
    store.recordGravityFlipRun('endless', 60);
    expect(usePlayerStore.getState().gravityFlip.endlessHighScore).toBe(60);
    expect(usePlayerStore.getState().unlockedAchievements['survivor']?.unlocked).toBe(true);
  });

  it('records laser level solves and unlocks puzzle achievements', () => {
    const store = usePlayerStore.getState();

    // Solve Level 1 with 3 stars
    store.recordLaserLevelSolve(1, 3, 2);
    const updated = usePlayerStore.getState();

    expect(updated.laserLab.levelsCompleted).toBe(1);
    expect(updated.laserLab.totalStars).toBe(3);
    expect(updated.unlockedAchievements['puzzle-starter']?.unlocked).toBe(true);
    expect(updated.unlockedAchievements['refraction-star']?.unlocked).toBe(true);
  });

  it('manages volume and mute states in settings store', () => {
    const settings = useSettingsStore.getState();
    expect(settings.volume).toBe(0.7);
    expect(settings.isMuted).toBe(false);

    settings.setVolume(0.4);
    expect(useSettingsStore.getState().volume).toBe(0.4);

    settings.toggleMute();
    expect(useSettingsStore.getState().isMuted).toBe(true);

    settings.setReducedMotion(true);
    expect(useSettingsStore.getState().reducedMotion).toBe(true);
  });
});
