---
type: Feature
title: Layout
description: App shell with sidebar chat layout on ChatView.
tags: [ui, architecture]
timestamp: 2026-07-15T00:00:00Z
---

# Hierarchy

```text
index.astro (client:only vue)
└── App.vue
    └── ThemeProvider
        └── RouterView
            └── AppLayout
                ├── AppHeader
                └── RouterView → HomeView (/) | ChatView (/chat) | auth views
```

`ChatView` uses full-bleed layout (`.chat-full-bleed`) with `ChatSidebar` + message column; `AppLayout` removes max-width padding when chat is active.
