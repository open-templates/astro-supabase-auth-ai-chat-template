# Agent & developer instructions — astro-supabase-auth-ai-chat-template

Use this file when turning this template into a **production SPA** with Supabase Auth and a Cloudflare Worker backend. This repository is **self-contained** for the UI and client-side auth; API calls require a separate worker (this template pairs with [cf-hono-supabase-gemini-api-template](https://github.com/open-templates/cf-hono-supabase-gemini-api-template) as the demo backend).

## What ships out of the box

| Feature | Description |
|---------|-------------|
| Google OAuth | Sign in / sign up via Supabase |
| Email auth | Login, signup, password recovery & reset |
| API health indicator | Header polls `GET /health` |
| **Home (`/`)** | `GET /me` JWT verification and session debug |
| **AI chat (`/chat`)** | Chat UI → `POST /chat` with Bearer JWT |

Details: [`index.md`](index.md)

---

## Prerequisites (required before development)

### 0. Local toolchain

- **Node.js ≥ 22.12** (required by Astro 7)
- **Bun** (recommended; see `packageManager` in `package.json`)

### 1. Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. **Settings → API** — copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon / publishable key** → `VITE_SUPABASE_PUBLISHABLE_KEY`
3. **Authentication → Providers → Email** — enable (default).

### 2. Google Cloud OAuth application (required for Google sign-in)

1. Open [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services**.
2. **OAuth consent screen** — configure (External), scopes: `email`, `profile`.
3. **Credentials → Create OAuth client ID** — type **Web application**.
4. **Authorized redirect URIs** — add exactly:
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```
   Find `<your-project-ref>` in your Supabase project URL.
5. Copy **Client ID** and **Client secret**.

### 3. Integrate Google with Supabase

1. Supabase dashboard → **Authentication → Providers → Google**.
2. Enable Google, paste Client ID and Client secret, save.

### 4. Supabase URL configuration

**Authentication → URL Configuration**:

| Setting | Local dev | Production |
|---------|-----------|------------|
| Site URL | `http://localhost:4321` | `https://your-app.pages.dev` |
| Redirect URLs | `http://localhost:4321` | `https://your-app.pages.dev` |

Add every origin you use (no trailing slash mismatches).

Step-by-step UI guide: [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md)

---

## Setup checklist

```bash
bun install
cp .env.example .env
```

`.env`:

```bash
VITE_SUPABASE_URL=https://<ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<anon-key>
VITE_API_BASE_URL=http://localhost:8787
```

```bash
bun run dev   # http://localhost:4321
```

Test:

1. Open `/login` — header should show API status (requires worker; see below).
2. Sign in with Google or email.
3. On `/` — session card + **Profile (API /me)** JSON.
4. On `/chat` — send a message (requires worker with `GEMINI_API_KEY`).

---

## Connecting the backend (missing piece for API calls)

This frontend does **not** include the API worker. For `/health`, `/me`, and `/chat`:

1. Clone or fork **[cf-hono-supabase-gemini-api-template](https://github.com/open-templates/cf-hono-supabase-gemini-api-template)**.
2. Complete **its** `INSTRUCTIONS.md` (same Supabase project credentials in worker `.dev.vars`; set `GEMINI_API_KEY` for chat).
3. Start worker: `npm run dev` (port `8787`).
4. Set worker `ALLOWED_ORIGINS=http://localhost:4321` (and production URL when deployed).
5. Deploy worker to Cloudflare; set `VITE_API_BASE_URL` to the worker URL in production.

Use the **same Supabase project** for both templates so JWTs issued to the browser are valid on the worker.

Test chat: sign in → `/chat` → send a message (requires worker with Gemini configured).

---

## Agent workflow (extending to production)

Read in order:

1. **`INSTRUCTIONS.md`** (this file) — OAuth + env setup
2. **`index.md`** — routes and API contract
3. **`.agents/skills/index.md`** — OKF module guides
4. **`.agents/skills/README.md`** — Cursor `SKILL.md` catalog

### Adding a feature page

1. **Backend route** in cf-hono template (if new API) — document in both `index.md` files
2. **API module**: `src/vue/api/<feature>.ts` using `apiFetch` — see `api-fetch` skill
3. **View**: `src/vue/views/` + route in `src/vue/router/index.ts` with `meta.requireAuth`
4. **Specs**: add or update `specs/features/` and link from `index.md`

### Rules

- Auth stays on Supabase client; domain data goes through the worker (`VITE_API_BASE_URL`).
- Never put service role keys in `VITE_*` variables.
- Token for API: `localStorage['x-auth-token']` (managed by `useAuth`).
- `signOut()` must call `clearAllChatState()` when chat is enabled.
- Run `bun run typecheck` before finishing.

---

## Repository map

```
src/pages/          index.astro (mounts Vue SPA)
src/vue/            App, router, views, components, api, lib
src/vue/views/      HomeView, ChatView, auth views
src/vue/api/        apiFetch, health, me, chat
src/vue/lib/        chat-threads.ts (cleared on sign-out)
index.md            OKF bundle root
specs/features/     Numbered feature specs
.agents/skills/     OKF modules + Cursor SKILL.md packs
.cursor/rules/      Cursor IDE rules
docs/               Supabase setup guide
```

---

## Deployment (Cloudflare Pages)

- Build: `bun run build`
- Output: `dist`
- Env vars: same `VITE_*` as `.env`
- Update Supabase redirect URLs to Pages domain

---

## Troubleshooting

| Issue | Check |
|-------|--------|
| Google OAuth redirect error | Redirect URI in Google = `https://<ref>.supabase.co/auth/v1/callback`; Site URL matches app origin |
| API offline in header | Worker running; `VITE_API_BASE_URL` correct |
| `/me` fails after login | Same Supabase project on worker; CORS `ALLOWED_ORIGINS` |
| Chat returns 500/502 | Worker has `GEMINI_API_KEY`; check worker logs |

---

## License

MIT — see `LICENSE`.
