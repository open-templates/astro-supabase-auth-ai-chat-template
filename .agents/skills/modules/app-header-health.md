---
type: Playbook
title: App header health
description: Poll GET /health every 30s and render status in AppHeader.
tags: [ui, health, api]
timestamp: 2026-07-15T00:00:00Z
resource: src/layout/AppHeader.tsx
---

# Hook

`useApiHealth` in `src/hooks/useApiHealth.ts` (or equivalent) calls `getHealth()` on mount and every **30 seconds**.

# States

| State | UI |
|-------|-----|
| `checking` | Yellow indicator |
| `online` | Green |
| `offline` | Red |

Visible on all routes including `/login`.

# See also

* [specs/features/06-health-indicator.md](../../specs/features/06-health-indicator.md)
