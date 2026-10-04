# RackTrack

A firearms, maintenance, and ammo tracking app.

Tracks what firearms you own, rounds put through each one, maintenance history, and ammo inventory by type/count. Built to run locally first, with a cloud-hosted version planned later.

## Current phase: UI-first

We're building the frontend against **demo data** before touching a backend. The plan:

1. Build out the dashboard, pages, and features we actually want, using hardcoded demo data (`apps/web/src/data/`).
2. Deploy a demo build to GitHub Pages so the UI is viewable without running anything locally.
3. Once the feature set feels right, design the API (endpoints, data shapes) to match what the UI actually needs — then swap demo data for real API calls.

This repo has no backend yet. That's intentional, not missing work.

## Stack

- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Package manager:** pnpm (workspaces, for when the API app is added back)
- **Planned backend (later):** Node + Fastify, REST API, PostgreSQL

## Getting started

Requires [pnpm](https://pnpm.io/installation).

```bash
pnpm install
pnpm dev
```

This runs the web app at `http://localhost:5173`.

Other useful commands:

```bash
pnpm --filter @racktrack/web build    # production build
pnpm --filter @racktrack/web lint     # lint the web app
```

## Project structure

```
RackTrack/
├── apps/
│   └── web/              # React app
│       ├── src/
│       │   ├── data/      # demo data standing in for the API
│       │   ├── App.tsx
│       │   └── main.tsx
├── pnpm-workspace.yaml
└── package.json
```

More `apps/*` packages (an API, shared types) get added once the UI phase wraps up.

## Tracking work

Feature work and ideas are tracked on the repo's [GitHub Project board](../../projects).
