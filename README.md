# astro-supabase-auth-ai-chat-template

**Astro + Vue + Supabase Auth** SPA with an authenticated **AI chat** page from [@open-templates](https://github.com/open-templates). Pairs with [cf-hono-supabase-gemini-api-template](https://github.com/open-templates/cf-hono-supabase-gemini-api-template).

The UI is a **client-only Vue SPA** (`vue-router`) mounted from `src/pages/index.astro` via `client:only="vue"`.

## Quick start

1. **Use this template** on GitHub, then clone your repo.
2. Personalize from `templates/`:

```bash
./scripts/init-from-template.sh
```

3. Install and run:

```bash
bun install
cp .env.example .env
bun run dev
```

4. Start the paired API worker ([cf-hono-supabase-gemini-api-template](https://github.com/open-templates/cf-hono-supabase-gemini-api-template)) on port `8787`.

See [`templates/ABOUT_TEMPLATES.md`](templates/ABOUT_TEMPLATES.md) and [`docs/INIT_TEMPLATE.md`](docs/INIT_TEMPLATE.md).

## Out-of-the-box features

| Feature | Description |
|---------|-------------|
| Google OAuth + email auth | Sign in, sign up, password recovery |
| API health indicator | Header polls `GET /health` |
| **Home (`/`)** | `GET /me` JWT verification + session debug |
| **AI chat (`/chat`)** | Chat UI → `POST /chat` with Bearer JWT |
| Session + token refresh | `apiFetch` attaches JWT and retries on `401` |
| Chat cleanup on sign out | `sessionStorage` threads cleared in `signOut()` |

See [`index.md`](index.md).

## Environment

| Variable | Purpose |
|----------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/publishable key |
| `VITE_API_BASE_URL` | Worker URL (default `http://localhost:8787`) |

## Stack

- Astro 7, Vue 3, TypeScript, vue-router
- Supabase Auth (`@supabase/supabase-js`)
- Tailwind CSS 4 (`@tailwindcss/vite`)
- Bun (package manager); **Node.js ≥ 22.12** (required by Astro 7)

## Scripts

- `bun run dev` — Astro dev server (default `http://localhost:4321`)
- `bun run build` / `bun run ci` — production build
- `bun run lint` / `bun run typecheck` — quality checks

## Deployment

Target: **Cloudflare Pages**. Build command `bun run build`, output directory `dist`. Set the same `VITE_*` variables in the Pages project settings. `public/_redirects` sends all paths to `index.html` for vue-router history mode.

Supabase + Google OAuth setup: [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md)

## License

MIT
