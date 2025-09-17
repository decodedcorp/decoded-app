// node scripts/check-i18n-keys.js
const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.resolve('src/locales');
const LOCALES = ['en', 'ko'];

function listNamespaces() {
  const bases = LOCALES.map(l => path.join(LOCALES_DIR, l));
  const set = new Set();
  bases.forEach(base => {
    if (!fs.existsSync(base)) return;
    fs.readdirSync(base).forEach(f => {
      if (f.endsWith('.json')) set.add(f);
    });
  });
  return Array.from(set);
}

function flatten(obj, prefix = '', out = {}) {
  Object.entries(obj || {}).forEach(([k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v, key, out);
    else out[key] = v;
  });
  return out;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

let hasError = false;
const namespaces = listNamespaces();

namespaces.forEach(nsFile => {
  const perLocale = {};
  LOCALES.forEach(l => {
    const p = path.join(LOCALES_DIR, l, nsFile);
    if (!fs.existsSync(p)) return;
    perLocale[l] = flatten(readJson(p));
  });
  const allKeys = new Set(Object.values(perLocale).flatMap(o => Object.keys(o || {})));
  LOCALES.forEach(l => {
    const keys = new Set(Object.keys(perLocale[l] || {}));
    const missing = [...allKeys].filter(k => !keys.has(k));
    if (missing.length) {
      hasError = true;
      console.error(`❌ Missing keys in ${l}/${nsFile}:`);
      missing.forEach(k => console.error(`  - ${k}`));
    }
  });
});

if (hasError) process.exit(1);
console.log('✅ i18n key parity OK');