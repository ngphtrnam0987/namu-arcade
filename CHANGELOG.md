# Changelog — NAMU ARCADE

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2026-11-14

### Initial Launch Release

#### Core Portal & Foundation
- Initialized React 19 + TypeScript + Vite 8 application with Tailwind CSS v4.
- Implemented **Dark Gaming & Modern Neon Arcade** design system:
  - Midnight Navy (`#070A14`, `#0F172A`)
  - Deep Purple (`#180D2B`, `#231242`)
  - Electric Cyan (`#00F0FF`)
  - Neon Violet (`#A855F7`)
  - Accent Pink (`#EC4899`)
- Integrated extensible **Game Registry** architecture with code-split lazy loading.
- Created full responsive navigation layout:
  - Navbar with responsive mobile drawer and audio controls.
  - Interactive Footer with system status indicators.
  - Home Page with hero animations, stats ribbon, and curated game cards.
  - Game Library Page with category filtering and text search.
  - Player Profile Page with nickname customization, stats, and real trophy room.
  - Settings Page with master volume slider, mute toggle, reduced motion, and shortcut guides.

#### Game 1: Gravity Flip
- Engineered a 60 FPS Canvas 2D precision physics runner.
- Implemented automatic forward velocity and gravity inversion physics.
- Implemented sub-pixel AABB collision detection with player hitbox inset.
- Added **Classic Mode** with 3 progressive stages (Neon Corridor, Cyber Rift, Hyper Velocity) and finish lines.
- Added **Endless Mode** with dynamically scaling speed and guaranteed solvable obstacle gaps.
- Integrated rocket thruster particle trails and crash explosion sparks.
- Implemented desktop (Space/Click/P/R) and dedicated mobile touch controls.

#### Game 2: Laser Lab
- Engineered a grid-based discrete optics simulation engine.
- Implemented real-time ray-tracing algorithm handling 90° mirror reflections, beam splitters, and barrier occlusions.
- Implemented cycle-detection to prevent infinite reflection loops.
- Created **15 handcrafted levels**:
  - 5 Beginner levels (Levels 1 - 5)
  - 5 Intermediate levels (Levels 6 - 10)
  - 5 Advanced levels (Levels 11 - 15)
- Added Move Counter, 3-Star Rating system, Undo stack, and Level Reset.
- Added celebration confetti animations and activation chimes.

#### Audio & Services
- Developed zero-dependency procedural Web Audio API synthesizer.
- Created sound effects for clicks, gravity flips, laser deflections, target activations, crashes, and victory fanfares.
- Built persistent `usePlayerStore` and `useSettingsStore` synced with localStorage.

#### Testing & Quality Assurance
- Configured Vitest test runner.
- Authored 23 comprehensive unit tests across physics, optics, solvability of all 15 levels, store persistence, and registry extensibility.
