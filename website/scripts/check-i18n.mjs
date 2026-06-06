#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

function flattenKeys(obj, prefix = '') {
  const keys = [];
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      keys.push(...flattenKeys(v, path));
    } else {
      keys.push(path);
    }
  }
  return keys.sort();
}

function listMdx(dir) {
  if (!safeExists(dir)) return [];
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...listMdx(full).map((p) => `${entry}/${p}`));
    } else if (entry.endsWith('.mdx') || entry.endsWith('.md')) {
      out.push(entry);
    }
  }
  return out.sort();
}

function safeExists(p) {
  try {
    statSync(p);
    return true;
  } catch {
    return false;
  }
}

function diff(a, b) {
  const setA = new Set(a);
  const setB = new Set(b);
  return {
    onlyInA: [...setA].filter((x) => !setB.has(x)),
    onlyInB: [...setB].filter((x) => !setA.has(x)),
  };
}

let failed = false;

// Check 1: i18n JSON key parity
const zh = JSON.parse(readFileSync(join(ROOT, 'src/i18n/zh.json'), 'utf-8'));
const en = JSON.parse(readFileSync(join(ROOT, 'src/i18n/en.json'), 'utf-8'));
const zhKeys = flattenKeys(zh);
const enKeys = flattenKeys(en);
const keyDiff = diff(zhKeys, enKeys);
if (keyDiff.onlyInA.length || keyDiff.onlyInB.length) {
  console.error('❌ i18n key mismatch:');
  if (keyDiff.onlyInA.length) console.error('  only in zh.json:', keyDiff.onlyInA);
  if (keyDiff.onlyInB.length) console.error('  only in en.json:', keyDiff.onlyInB);
  failed = true;
} else {
  console.log(`✓ i18n keys match (${zhKeys.length} keys)`);
}

// Check 2: docs file parity
const zhDocs = listMdx(join(ROOT, 'src/content/docs-zh'));
const enDocs = listMdx(join(ROOT, 'src/content/docs-en'));
const docsDiff = diff(zhDocs, enDocs);
if (docsDiff.onlyInA.length || docsDiff.onlyInB.length) {
  console.error('❌ docs file mismatch:');
  if (docsDiff.onlyInA.length) console.error('  only in docs-zh:', docsDiff.onlyInA);
  if (docsDiff.onlyInB.length) console.error('  only in docs-en:', docsDiff.onlyInB);
  failed = true;
} else {
  console.log(`✓ docs files match (${zhDocs.length} files)`);
}

process.exit(failed ? 1 : 0);
