#!/usr/bin/env node

import { initFromTemplate } from './lib/template-init/index.js';
import { ASTRO_SPA_AI_CHAT_MANIFEST } from './lib/template-init/manifests/astro-spa-ai-chat.js';
import { printHelp } from './lib/template-init/parse-args.js';
import { brandHeader, error as printError } from './lib/template-init/terminal.js';

const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  brandHeader('astro supabase auth ai chat template');
  printHelp('astro-supabase-auth-ai-chat-template');
  process.exit(0);
}

initFromTemplate({
  manifest: ASTRO_SPA_AI_CHAT_MANIFEST,
  includePackageName: false,
  includeAuthorStep: true,
  includeBundler: true,
  defaultBundler: 'bun',
  templateLabel: 'astro supabase auth ai chat template',
  authorStep: {
    stepTitle: 'maintainer (Git owner)',
    selectMessage: 'How should we set the package maintainer?',
    acceptLabel: 'Accept detected Git owner',
  },
  scriptsCleanup: 'all',
  extraReplacements: [['paired-repo-name', 'cf-hono-supabase-gemini-api-template']],
  nextSteps: 'bun install, cp .env.example .env, then bun run dev',
}).catch((err) => {
  printError(`Init failed: ${err.message}`);
  process.exit(1);
});
