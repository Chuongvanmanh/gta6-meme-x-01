// gta6-meme-x-01 entry (Node 22, standard library only): validates POST.json (an X post address) and copies it to
// /output/POST.json, where the gate reads it. The entry is the post itself; the house reads it from X.
// Outside the grader: MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const SRC = join(BOT_DIR, 'POST.json');

try {
  const post = JSON.parse(readFileSync(SRC, 'utf8')) as { url?: unknown };
  const ok =
    typeof post.url === 'string' &&
    /^https:\/\/((www|mobile)\.)?(x|twitter)\.com\/[A-Za-z0-9_]+\/status\/\d+\/?(\?.*)?(#.*)?$/.test(post.url);
  if (!ok) {
    console.error('POST.json url must look like https://x.com/<handle>/status/<id>');
    process.exit(1);
  }
  mkdirSync(OUTPUT_DIR, { recursive: true });
  copyFileSync(SRC, join(OUTPUT_DIR, 'POST.json'));
} catch (err) {
  console.error(`POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
