---
type: Reference
title: Key files
description: Source map for chat, auth, and API modules.
tags: [reference]
timestamp: 2026-07-16T00:00:00Z
---

| Path | Role |
|------|------|
| `src/pages/index.astro` | Astro shell; mounts Vue SPA (`client:only`) |
| `src/vue/views/HomeView.vue` | Authenticated home + `/me` debug |
| `src/vue/views/ChatView.vue` | Chat UI, thread state, message flow |
| `src/vue/components/chat/ChatMarkdown.vue` | GFM renderer for assistant bubbles |
| `src/vue/components/chat/ChatSidebar.vue` | Session thread list |
| `src/vue/lib/chat-threads.ts` | `sessionStorage` persistence |
| `src/vue/api/chat.ts` | `POST /chat` client |
| `src/vue/api/api.ts` | `apiFetch` with JWT + refresh |
| `src/vue/composables/useAuth.ts` | Supabase auth + `clearAllChatState` on sign out |
| `src/vue/router/index.ts` | Routes including `/chat` |
