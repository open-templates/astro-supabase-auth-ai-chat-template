import { COMMON_MANIFEST } from './common.js';

/** @type {[string, string][]} */
export const ASTRO_SPA_AI_CHAT_MANIFEST = [
  ...COMMON_MANIFEST.filter(([from]) => from !== 'INSTRUCTIONS.md'),
  ['package.json', 'package.json'],
  ['README.md', 'README.md'],
  ['INSTRUCTIONS.md', 'INSTRUCTIONS.md'],
  ['astro.config.mjs', 'astro.config.mjs'],
  ['tsconfig.json', 'tsconfig.json'],
  ['public/_redirects', 'public/_redirects'],
];
