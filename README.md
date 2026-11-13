# NAMU ARCADE — Your Little Universe of Games

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build & Test](https://img.shields.io/badge/Tests-23%20Passing-brightgreen.svg)]()
[![Platform: Web](https://img.shields.io/badge/Platform-Web%20(Desktop%20%26%20Mobile)-cyan.svg)]()
[![Cloudflare: Workers](https://img.shields.io/badge/Deployed-Cloudflare%20Workers-orange.svg)]()

> **NAMU ARCADE** is a premier, dark-neon web arcade portal built from the ground up for instantaneous browser gaming with zero downloads, zero ads, and zero latency.

---

## 🎮 Launch Games (V1.0)

### 1. Gravity Flip — High-Octane 2D Precision Runner
- **Genre:** Arcade / Action
- **Mechanics:** Sub-pixel gravity inversion between floor and ceiling rails.
- **Modes:**
  - **Classic Mode:** 3 handcrafted levels (*Neon Corridor*, *Cyber Rift*, *Hyper Velocity*) with concrete distance finish lines.
  - **Endless Mode:** Procedural obstacle hazard spawning with dynamically accelerating speed and guaranteed solvable paths.
- **Controls:**
  - **Desktop:** `Space` or Left Click to invert gravity, `P` to pause/resume, `R` to restart.
  - **Mobile:** Fullscreen touch tap area + on-screen pause/restart action buttons.
- **VFX & Audio:** Rocket thruster trail, dynamic neon landing blooms, crash spark explosions, procedural sound synthesis.

### 2. Laser Lab — Optics Matrix Puzzle Challenge
- **Genre:** Puzzle / Strategy
- **Mechanics:** Real-time ray-tracing engine simulating light propagation, 90° angular mirror reflections, and prism beam splitters.
- **Content:** Exactly **15 verified solvable levels** across 3 progression tiers:
  - **Beginner (Levels 1 - 5):** Fundamental reflection geometry and perimeter routing.
  - **Intermediate (Levels 6 - 10):** Wall maze navigation and dual-sensor bifurcations.
  - **Advanced (Levels 11 - 15):** Quantum core splits, nested prisms, and 4-sensor multi-routing.
- **Features:** Move counter, 3-Star rating system, Undo history stack, level reset, and victory confetti.
- **Controls:** Click or tap any mirror/splitter to rotate 90°, `Z` to undo, `R` to reset.

---

## ✨ Platform Features

- **Neon Arcade Visual Identity:** Dark gaming aesthetic inspired by midnight neon cyberpunk palettes (electric cyan, neon violet, midnight navy, and radiant pink accents).
- **Player Passport & Trophy Room:** Player nickname customization, aggregate session statistics, personal best score records, and 8 gameplay-driven achievements stored in `localStorage`.
- **Procedural Sound Engine:** 100% self-contained Web Audio API synthesizer generating responsive chimes, lasers, thrusts, and fanfares with zero network latency.
- **Full Accessibility:** Reduced motion mode, responsive scaling for mobile, tablet, and ultra-wide screens, zero mock buttons.
- **Modular Game Registry:** Add new games in isolated folders without modifying core navigation or portal layouts. See [ADDING_NEW_GAMES.md](./ADDING_NEW_GAMES.md).

---

## 🛠 Tech Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite 8
- **Styling:** Tailwind CSS v4
- **Game 1 Engine:** HTML5 Canvas 2D + 60 FPS Subpixel Physics Loop
- **Game 2 Engine:** Reactive Vector SVG + Custom Discrete Ray-Tracing Algorithm
- **State Management:** Zustand v5 with LocalStorage Persistence
- **Audio:** Web Audio API Procedural Synthesizer
- **Testing:** Vitest v5 (23 Unit Tests)
- **Deployment:** Cloudflare Workers / Cloudflare Pages

---

## 🚀 Getting Started

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/namu-arcade/namu-arcade.git
cd namu-arcade
npm install
```

### Development Server

Start the local Vite development server with Hot Module Replacement:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### Running Test Suites

Execute all unit test suites (physics, optics, solvability, stores, registry):

```bash
npm run test
```

### Production Build

Compile TypeScript and build optimized, code-split client bundles:

```bash
npm run build
```

Production artifacts are generated in the `dist/` directory.

---

## 📖 Documentation Directory

- **[ARCHITECTURE.md](./ARCHITECTURE.md):** Deep-dive into technical architecture, state flow, and performance guarantees.
- **[ADDING_NEW_GAMES.md](./ADDING_NEW_GAMES.md):** Step-by-step tutorial on integrating new games into the registry.
- **[DEPLOYMENT.md](./DEPLOYMENT.md):** Production hosting setup on Cloudflare Workers and Pages.
- **[ASSETS.md](./ASSETS.md):** Licensing, attribution, and procedural generation specifications.
- **[CHANGELOG.md](./CHANGELOG.md):** Release notes and version history.

---

## 🌐 Deployment & Live Demo

- **Repository:** Public repository on GitHub.
- **Cloudflare Production URL:** Deployed to Cloudflare Workers edge network.
- **Offline & PWA Ready:** Zero external asset dependencies ensures smooth offline play.

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for details.
