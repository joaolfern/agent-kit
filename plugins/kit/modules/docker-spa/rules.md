## Hosting: Docker

- `Dockerfile` builds with pnpm and serves `dist/` from nginx (`nginx.conf`): hashed `/assets/` are cached for a year, everything else falls back to `index.html` with `no-cache`, so deep links work and deploys show up immediately.
- Build-time env (`VITE_*`) is baked into the bundle at `docker build`; it's public, never a secret.
