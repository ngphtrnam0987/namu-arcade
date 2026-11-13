import { create } from 'zustand';
import { soundService } from '../services/sound';

interface SettingsState {
  volume: number;
  isMuted: boolean;
  reducedMotion: boolean;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  setMuted: (muted: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  resetSettings: () => void;
}

const STORAGE_KEY = 'namu_arcade_settings_v1';

const getInitialSettings = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          volume: typeof parsed.volume === 'number' ? parsed.volume : 0.7,
          isMuted: typeof parsed.isMuted === 'boolean' ? parsed.isMuted : false,
          reducedMotion: typeof parsed.reducedMotion === 'boolean' ? parsed.reducedMotion : false,
        };
      }
    }
  } catch (e) {
    // ignore
  }
  return {
    volume: 0.7,
    isMuted: false,
    reducedMotion: false,
  };
};

const initial = getInitialSettings();
soundService.setVolume(initial.volume);
soundService.setMuted(initial.isMuted);

export const useSettingsStore = create<SettingsState>((set, get) => ({
  volume: initial.volume,
  isMuted: initial.isMuted,
  reducedMotion: initial.reducedMotion,

  setVolume: (v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    soundService.setVolume(clamped);
    set({ volume: clamped });
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const current = get();
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ volume: clamped, isMuted: current.isMuted, reducedMotion: current.reducedMotion })
        );
      }
    } catch {}
  },

  toggleMute: () => {
    const nextMuted = !get().isMuted;
    soundService.setMuted(nextMuted);
    set({ isMuted: nextMuted });
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const current = get();
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ volume: current.volume, isMuted: nextMuted, reducedMotion: current.reducedMotion })
        );
      }
    } catch {}
  },

  setMuted: (muted: boolean) => {
    soundService.setMuted(muted);
    set({ isMuted: muted });
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const current = get();
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ volume: current.volume, isMuted: muted, reducedMotion: current.reducedMotion })
        );
      }
    } catch {}
  },

  setReducedMotion: (reduced: boolean) => {
    set({ reducedMotion: reduced });
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const current = get();
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ volume: current.volume, isMuted: current.isMuted, reducedMotion: reduced })
        );
      }
    } catch {}
  },

  resetSettings: () => {
    soundService.setVolume(0.7);
    soundService.setMuted(false);
    set({ volume: 0.7, isMuted: false, reducedMotion: false });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  },
}));
