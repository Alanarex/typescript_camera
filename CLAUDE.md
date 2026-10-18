# CLAUDE.md

## Stack
- Frontend: React 18, TypeScript ~5.6, Vite 6, React Router 6, Leaflet, SweetAlert2, `vite-plugin-pwa`.
- Backend: Node.js (ESM) + Express 4 + Socket.IO 4, in-memory state, no database.
- No Docker, no CI, no automated tests (yet).

## Structure
- `src/pages/`, `src/components/`, `src/context/` (socket + location), `src/styles/`: frontend.
- `server/server.js`: the whole backend.
- `public/`: PWA assets. `docs/deployment.md`: VPS/Apache/PM2 guide.
- App base path is `/typescript_camera` (see `vite.config.ts` and `Router basename`).

## Commands
- Install: `npm install` (then `cp .env.example .env`)
- Backend: `node server/server.js` (note: `npm start` points to a missing `server/index.js`)
- Dev frontend: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint` (currently fails on main: `no-explicit-any` and hook warnings)
- Tests: none

## Conventions
- TypeScript strict mode via `tsconfig.app.json`; function components with hooks.
- One CSS file per page/component in `src/styles/`.
- Config only through `VITE_*` variables / `.env`; `.env` is git-ignored, `.env.example` is the template.

## Repo rules
- Work on a `refresh/<topic>` branch and open a PR; never commit directly to `main`.
- Never commit secrets or `.env`. Never rewrite history or force-push without explicit approval.
- Do not alter commit dates or authors.

## Known issues
- Unauthenticated REST endpoints can clear messages or remove users; socket payloads are not validated.
- `react-router-dom` 6 has 2 moderate advisories (fix requires v7).
- Messages and photos are not persisted server-side (photos live in `localStorage`).
