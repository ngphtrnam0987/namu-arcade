# Assets & Intellectual Property Attribution

This document describes all assets utilized in NAMU ARCADE V1.0.

---

## 1. Graphic & Vector Assets

All graphical visual assets are 100% procedural SVGs hand-coded for NAMU ARCADE:

| Asset | Location | Author / Source | License |
| :--- | :--- | :--- | :--- |
| **NAMU ARCADE Logo** | `public/logo.svg` | NAMU ARCADE Team | MIT / Custom |
| **Gravity Flip Thumbnail** | `public/thumbnails/gravity-flip.svg` | NAMU ARCADE Team | MIT / Custom |
| **Laser Lab Thumbnail** | `public/thumbnails/laser-lab.svg` | NAMU ARCADE Team | MIT / Custom |
| **Lucide React Icons** | Bundled via `lucide-react` | Lucide Project | ISC License |

---

## 2. Audio & Sound FX

All audio sound effects are **100% synthetically generated** in the browser using the native **Web Audio API** (`src/services/sound.ts`):
- No external `.mp3`, `.wav`, or `.ogg` audio files are downloaded or hosted.
- Frequencies, envelopes, and oscillator shapes (sine, triangle, sawtooth) are procedurally computed in real-time.
- Completely free of external royalties, tracking, or network latency.

---

## 3. Libraries & Dependencies

All dependencies are standard open-source packages governed by permissible licenses (MIT, ISC, Apache 2.0):
- `react`, `react-dom` (MIT)
- `react-router-dom` (MIT)
- `zustand` (MIT)
- `lucide-react` (ISC)
- `canvas-confetti` (ISC)
- `tailwindcss` (MIT)
- `vitest` (MIT)
