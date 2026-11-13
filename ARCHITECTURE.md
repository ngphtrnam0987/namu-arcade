# NAMU ARCADE — System Architecture & Design Specification

**Version:** 1.0.0  
**Tagline:** Your Little Universe of Games

---

## 1. System Architectural Overview

NAMU ARCADE is structured as a client-side Single Page Application (SPA) with a decoupled, modular micro-arcade architecture. The platform prioritizes:
- **Instant startup & zero load overhead:** Sub-second time-to-interactive.
- **Isolated game runtimes:** Each mini-game runs in a sandboxed module with independent physics, rendering loops, and state isolation.
- **Unified cross-cutting systems:** Global audio synthesis, persistent local storage, progress tracking, and reactive achievement broadcasts.

```
                  +-----------------------------------+
                  |         NAMU ARCADE SPA           |
                  |     (React 19 + TypeScript)       |
                  +-----------------+-----------------+
                                    |
          +-------------------------+-------------------------+
          |                         |                         |
+---------v----------+    +---------v----------+    +---------v----------+
|  Global Services   |    |    State Stores    |    |   Game Registry    |
| - Web Audio API    |    | - usePlayerStore   |    | - Metadata Engine  |
| - Sound Synthesizer|    | - useSettingsStore |    | - Lazy Route Loader|
| - Theme / Confetti |    | - localStorage API |    | - Controls Manager |
+--------------------+    +--------------------+    +---------+----------+
                                                              |
                                    +-------------------------+-------------------------+
                                    |                                                   |
                         +----------v----------+                             +----------v----------+
                         |  Game 1: Gravity    |                             |   Game 2: Laser     |
                         |        Flip         |                             |        Lab          |
                         | - Sub-pixel Physics |                             | - Optics Ray Tracer |
                         | - 60 FPS Canvas 2D  |                             | - 15 Solvable Levels|
                         | - Particle Engine   |                             | - SVG Matrix Engine |
                         +---------------------+                             +---------------------+
```

---

## 2. Directory Layout

```
namu-arcade/
├── public/                     # Static icons, vector thumbnails, and branding
│   ├── logo.svg                # Vector brand emblem
│   └── thumbnails/             # High-res SVG art for game cards
├── src/
│   ├── components/             # Reusable UI & Layout
│   │   ├── layout/             # Navbar, Footer, App Layout
│   │   └── ui/                 # GameCard, AchievementToast
│   ├── games/                  # Independent game packages
│   │   ├── registry.ts         # Central dynamic registry
│   │   ├── gravity-flip/       # Game 1: Gravity Flip
│   │   │   ├── GravityFlipGame.tsx
│   │   │   └── engine/         # Physics, level generator, types
│   │   └── laser-lab/          # Game 2: Laser Lab
│   │       ├── LaserLabGame.tsx
│   │       └── engine/         # Ray tracing, 15 levels, types
│   ├── pages/                  # Route views (Home, Library, Profile, Settings)
│   ├── services/               # Procedural Web Audio synthesizer
│   ├── store/                  # Zustand persistent player & settings stores
│   ├── tests/                  # Vitest test suites (23 test specs)
│   ├── types/                  # Global types & achievement catalog
│   ├── App.tsx                 # Routing provider
│   └── main.tsx                # React application entry
└── vite.config.ts              # Bundler config & Tailwind v4 plugin
```

---

## 3. Technology Stack

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | React 19 + TypeScript | Strict type safety, modern concurrent rendering, seamless state handling. |
| **Build Tool** | Vite 8 | Instant Hot Module Replacement (HMR) and optimized rollup production bundles. |
| **Styling** | Tailwind CSS v4 | Zero-runtime CSS extraction, customizable neon aesthetic utilities. |
| **Game 1 Engine** | HTML5 Canvas 2D | High-precision 60 FPS physics loop, custom particles, sub-pixel collision. |
| **Game 2 Engine** | Reactive Vector SVG | Clean resolution-independent optics rendering, exact matrix coordinate transforms. |
| **Audio Engine** | Web Audio API | Zero external assets, zero bandwidth, instant sound synthesis with master gain. |
| **State & Store** | Zustand v5 | Lightweight, un-opinionated state containers with local storage synchronization. |
| **Testing** | Vitest v5 | Fast in-memory unit testing for physics, optics algorithms, and store state. |
| **Deployment** | Cloudflare Workers | Edge distribution, instant global caching, SSL, and low latency. |

---

## 4. Game Registry Design

The Game Registry pattern (`src/games/registry.ts`) enables hot-pluggable additions of new titles. Every game exposes:
- **Identifier & Routing:** Canonical slugs and deep links (e.g. `/games/gravity-flip`).
- **Metadata:** Name, tagline, description, difficulty rating, visual tags, launch date.
- **Control Specifications:** Dynamic keybinding and touch gesture hints rendered on HUDs.
- **Code Splitting:** Standard `React.lazy()` chunking ensures users only download game assets when they launch that game.

---

## 5. Procedural Sound System

NAMU ARCADE eliminates network dependencies for audio by utilizing the browser's native **Web Audio API**:
- **Flip Tone:** Frequency ramp from 320 Hz to 740 Hz using sine wave oscillators.
- **Laser Deflection:** Sawtooth chirp from 880 Hz to 1320 Hz.
- **Sensor Lock:** 3-voice harmonic triad (C5 - E5 - G5).
- **Victory Fanfare:** A major triad sequence (A4 - C#5 - E5 - A5).
- **Audio Lifecycle:** Audio context resumes on user click; master gain is bounded by the global volume slider and mute toggle.

---

## 6. Performance & Lifecycle Guarantees

1. **Animation Loop Termination:** Game loops in `GravityFlipGame` utilize `requestAnimationFrame` anchored to component mounts. When a player navigates back to the library, the loop cancels immediately, preventing background CPU burn.
2. **Infinite Loop Protection in Optics:** `LaserLab` traces light up to a bounded recursion depth and maintains a state hash set `(r, c, dr, dc)` to break bidirectional reflection loops.
3. **No Memory Leaks:** Transient arrays (particles, trail nodes, ray segments) are bounded by maximum capacities or recycled on frame tick.
