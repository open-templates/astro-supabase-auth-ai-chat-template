# astro-supabase-auth-ai-chat-template — Agent Skills Index

Skills in `.agents/skills/` teach agents how this repository works and how to extend it safely.

## Project status (current template)

**Astro 7** shell with a **Vue 3 chat SPA** (`src/vue/`, `client:only`), **Supabase Auth**, paired with **cf-hono-supabase-gemini-api-template**:

- **Auth:** Google OAuth + email/password (Vue composables under `src/vue/`)
- **API calls:** `GET /health` (header), `GET /me` (home), `POST /chat` (chat) via `apiFetch`
- **Routes:** `/`, `/chat`, `/login`, `/signup`, `/recover-password`, `/reset-password`
- **Chat:** multi-turn threads in `sessionStorage`; assistant replies rendered with `markdown-it`

Canonical OKF specs: [`index.md`](../../index.md) · OKF modules: [`.agents/skills/index.md`](index.md)

## OKF modules (local)

| Module | Use when |
|--------|----------|
| [api-fetch](modules/api-fetch.md) | `apiFetch` with Bearer token and 401 retry |
| [chat-page](modules/chat-page.md) | Chat view send flow and UI state |
| [chat-threads](modules/chat-threads.md) | `sessionStorage` thread list and cleanup on sign-out |
| [chat-markdown](modules/chat-markdown.md) | `markdown-it` for assistant bubbles |

Shared concepts (synced): [shared/auth/](shared/auth/) · [shared/supabase/](shared/supabase/)

## Agent read order

1. `INSTRUCTIONS.md` → `index.md` → this file → `shared/auth/`
