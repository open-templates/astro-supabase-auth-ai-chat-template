---
type: Feature
title: Purpose
description: Supabase-authenticated Astro + Vue SPA with built-in AI chat calling a paired worker.
tags: [frontend, ai, chat, supabase]
timestamp: 2026-07-15T00:00:00Z
---

# Purpose

Astro serves a single page; the **Vue 3** SPA (`vue-router`) handles auth routes and chat UI.

Browser holds the Supabase session; the Cloudflare Worker validates JWTs and runs chat completions server-side.

Pairs with [cf-hono-supabase-gemini-api-template](https://github.com/open-templates/cf-hono-supabase-gemini-api-template).
