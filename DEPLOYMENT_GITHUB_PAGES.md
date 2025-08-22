# GitHub Pages Deployment Guide (Vite + React)

This guide captures everything needed to deploy a Vite + React SPA to GitHub Pages reliably. It also documents the specific issues we hit in this repo and the fixes so you can reuse them for future projects.

## TL;DR Checklist

- Set Vite `base` to the repo name in production
- Add 404 fallback + SPA redirect script
- Use `BrowserRouter` with `basename`
- Import images/icons from `src/assets` instead of referencing `/public`
- Use a single Pages workflow at `.github/workflows/deploy.yml`

---

## 1) Vite config

File: `app/vite.config.js`

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // IMPORTANT: set base when deployed under username.github.io/<repo>
  base: process.env.NODE_ENV === 'production' ? '/-mandal-minds-interview-platform/' : '/',
  build: { outDir: 'dist', assetsDir: 'assets' },
  assetsInclude: ['**/*.svg', '**/*.woff2', '**/*.woff', '**/*.ttf'],
})
```

Why: GitHub Pages serves the app under `/<repo>/`. Without `base`, assets and chunks request from `/`, causing 404s.

---

## 2) Router basename

File: `app/src/App.jsx`

```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// ...

function App() {
  const basename = process.env.NODE_ENV === 'production' ? '/-mandal-minds-interview-platform' : ''
  return (
    <Router basename={basename}>
      <Routes>
        {/* routes */}
      </Routes>
    </Router>
  )
}
```

Why: GitHub Pages hosts at `/<repo>/`. The router must be aware of the base path for navigation and direct-linking.

---

## 3) SPA 404 fallback

Files: `app/public/404.html` and script in `app/index.html`

- 404.html redirects unknown paths back to `index.html` (SPA behavior)
- `index.html` includes the companion script to decode redirected URLs

Resources: https://github.com/rafgraph/spa-github-pages

---

## 4) Images, logos, icons – DO THIS

- Put assets under `app/src/assets/`
- Import them in React and use the imported URLs

```jsx
import logoSvg from '../assets/logo.svg'
<img src={logoSvg} alt="Logo" />
```

Why: Vite fingerprints, uploads, and rewrites paths correctly for GitHub Pages. Do NOT hardcode `/logo.svg` or rely on `public/` for routable assets when deploying under a subpath.

What we fixed in this repo:
- Replaced absolute paths like `/logo.svg` and `/flogo.svg` with imported assets
- Moved `logo.svg` and `flogo.svg` to `src/assets/`

---

## 5) GitHub Actions workflow (single source of truth)

File: `.github/workflows/deploy.yml`

- Remove any other Pages workflows (e.g., `static.yml`)
- Build from `app/` and upload `app/dist` artifact

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: './app/package-lock.json'
      - name: Install
        run: |
          cd app
          npm ci
      - name: Build
        run: |
          cd app
          npm run build
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: './app/dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## 6) Common issues we hit (and fixes)

- 404 on deep links (e.g., `/resume`)
  - Fix: Add `404.html` + SPA redirect script and `Router basename`

- Blank screen locally when `base` was hardcoded
  - Fix: Make `base` conditional on `NODE_ENV`

- Logos/icons not rendering on GitHub Pages
  - Root cause: absolute paths (`/logo.svg`) and public folder lookups under subpath
  - Fix: import assets from `src/assets` and use the imported variable

- Wrong workflow deploying (uploaded raw repo instead of build)
  - Fix: remove `.github/workflows/static.yml`; keep only `deploy.yml`

---

## 7) End-to-end steps for a new project

1. Create Vite + React app
2. Add router `basename` and Vite `base` (conditional)
3. Add SPA 404 fallback files (404.html + index.html script)
4. Place all images/icons in `src/assets/` and import them
5. Add `.github/workflows/deploy.yml` (above)
6. Push to `main`
7. In repo Settings → Pages → Source: select "GitHub Actions"
8. Wait for the workflow to finish, then open:
   `https://<username>.github.io/<repo>/`

---

## 8) Verify deployment

- Check Actions tab for green runs
- Open main URL and navigate to nested routes
- Inspect the network panel – assets should load from `/<repo>/assets/...`

---

## 9) Useful debugging commands

```bash
# Local build preview
cd app && npm run build && npx serve dist

# Check deployed artifact URL
curl -I https://<username>.github.io/<repo>/

# Test a bundled asset
curl -I https://<username>.github.io/<repo>/assets/index-*.js
```

---

## 10) Template snippets for reuse

- Asset import:
```jsx
import imgUrl from '../assets/image.png'
<img src={imgUrl} alt="" />
```

- Conditional base path:
```js
base: process.env.NODE_ENV === 'production' ? '/<repo>/' : '/'
```

- Router basename:
```jsx
<Router basename={process.env.NODE_ENV === 'production' ? '/<repo>' : ''}>
```

- SPA fallback: see section 3

---

With these in place, future Vite + React projects will deploy cleanly to GitHub Pages without broken routes or missing logos/icons.

---

## 11) Mandatory: Refresh-safe SPA routing (No 404 on refresh)

Make this policy standard for all your Vite + React projects deployed to GitHub Pages. It guarantees that reloading any route (e.g., `/resume`, `/manage-jds`, `/manage-resume`) does not show a 404 page and instead loads the intended page.

### Required files and settings

1) Add `404.html` to `public/` so it is copied to `dist/` by Vite:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Redirecting…</title>
    <script type="text/javascript">
      // SPA GitHub Pages redirect (rafgraph)
      // Keep first path segment (the repo name) for project pages
      var pathSegmentsToKeep = 1;
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body></body>
  </html>
```

2) Add the paired decoding script in `index.html` (inside `<head>`):

```html
<script type="text/javascript">
  // Decode redirect (rafgraph)
  (function(l) {
    if (l.search[1] === '/') {
      var decoded = l.search.slice(1).split('&').map(function(s) {
        return s.replace(/~and~/g, '&');
      }).join('?');
      window.history.replaceState(null, null, l.pathname.slice(0, -1) + decoded + l.hash);
    }
  }(window.location));
  </script>
```

3) Configure Router `basename` and Vite `base` (already in this repo):

```jsx
<Router basename={process.env.NODE_ENV === 'production' ? '/<repo>' : ''}>
```

```js
base: process.env.NODE_ENV === 'production' ? '/<repo>/' : '/'
```

### Verify no-404 behavior

- Build locally: `cd app && npm run build && npx serve dist`
- Test direct URLs in the served preview, and after deploy test all of:
  - `https://<user>.github.io/<repo>/`
  - `https://<user>.github.io/<repo>/resume`
  - `https://<user>.github.io/<repo>/manage-jds`
  - `https://<user>.github.io/<repo>/manage-resume`
- Reload each page (Cmd/Ctrl+R) — it should never show GitHub’s 404; it should route back into the SPA page.

This repository already implements all three requirements above.

- Manage pages (Manage JDs/Manage Resume) logo not rendering in sidebar
  - Fix: replace any remaining `import.meta.env.BASE_URL` logo references with imported `logoSvg` from `src/assets` (done in both files).
- 404 on refresh inside nested routes (e.g., /manage-resume, /manage-jds)
  - Fix: ensured 404.html redirect + index.html SPA script present; router basename configured; verified working after deploy.
