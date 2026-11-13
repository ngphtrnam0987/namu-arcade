# Deployment Guide — NAMU ARCADE

This document details the build, configuration, and deployment processes for NAMU ARCADE on Cloudflare Workers / Cloudflare Pages.

---

## 1. Prerequisites

- **Node.js:** v18.0.0 or later (v26.x supported).
- **Package Manager:** npm v9+.
- **Wrangler CLI:** Cloudflare developer CLI (`npm install -g wrangler` or `npx wrangler`).

---

## 2. Local Production Build

Before deploying, run the production build and test suites to verify bundle integrity:

```bash
# 1. Run unit test suite
npm run test

# 2. Compile TypeScript and build client distribution
npm run build
```

This compiles static production assets into the `dist/` directory:
- `dist/index.html`
- `dist/assets/*.js` (code-split bundles for core, Gravity Flip, Laser Lab, confetti)
- `dist/assets/*.css`
- `dist/thumbnails/*.svg`
- `dist/logo.svg`

---

## 3. Cloudflare Configuration (`wrangler.jsonc` / `wrangler.toml`)

NAMU ARCADE is configured to serve static assets with client-side SPA routing fallback directly through Cloudflare:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "namu-arcade",
  "compatibility_date": "2026-11-14",
  "assets": {
    "directory": "./dist",
    "binding": "ASSETS",
    "not_found_handling": "single-page-application"
  }
}
```

The `"not_found_handling": "single-page-application"` setting guarantees that direct navigation to sub-routes (such as `/games/gravity-flip`, `/games/laser-lab`, `/profile`, `/settings`) returns `index.html` seamlessly without 404 errors.

---

## 4. Deployment Commands

### Option A: Direct Production Deployment with Authenticated Account
If your Cloudflare credentials or API token are configured in environment variables (`CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID`) or via `npx wrangler login`:

```bash
npx wrangler deploy
```

### Option B: Cloudflare Pages / Temporary Preview Deployment
To generate an immediate edge deployment:

```bash
npx wrangler pages deploy dist --project-name namu-arcade
# or
npx wrangler deploy --temporary
```

---

## 5. Continuous Deployment via GitHub Actions

To automatically build and deploy whenever code is pushed to the `main` branch, add `.github/workflows/deploy.yml`:

```yaml
name: Deploy NAMU ARCADE

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
      - run: npm ci
      - run: npm run test
      - run: npm run build
      - name: Deploy to Cloudflare
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: deploy
```
