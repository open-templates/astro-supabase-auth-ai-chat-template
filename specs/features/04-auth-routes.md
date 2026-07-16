---
type: Feature
title: Auth routes
description: Guest and authenticated routes including /chat.
tags: [auth, routing]
timestamp: 2026-07-15T00:00:00Z
---

# Routes

| Route | Guard | Component |
|-------|-------|-----------|
| `/login` | Guest | `LogInView` |
| `/signup` | Guest | `SignUpView` |
| `/recover-password` | Guest | `RecoverPasswordView` |
| `/reset-password` | Auth | `ResetPasswordView` |
| `/` | Auth | `HomeView` — `GET /me` debug |
| `/chat` | Auth | `ChatView` — `POST /chat` |

Guests hitting `/` or `/chat` redirect to `/login`.
