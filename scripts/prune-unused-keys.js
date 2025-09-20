// node scripts/prune-unused-keys.js
const fs = require('fs');
const path = require('path');

const SRC_DIR = path.resolve('src');
const LOCALES_DIR = path.resolve('src/locales');
const LOCALES = ['en', 'ko'];
const CODE_EXT = new Set(['.ts', '.tsx', '.js', '.jsx']);

function walk(dir, files = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) walk(p, files);
    else files.push(p);
  }
  return files;
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

const code = walk(SRC_DIR).filter(f => CODE_EXT.has(path.extname(f)));
const codeText = code.map(f => fs.readFileSync(f, 'utf8')).join('\n');

// t('ns.key') 또는 t("ns.key") 탐색 + Trans i18nKey=""
const KEY_REGEXES = [
  /t\(\s*['"]([\w-]+(?:\.[\w-]+)+)['"]/g,
  /i18nKey=\s*['"]([\w-]+(?:\.[\w-]+)+)['"]/g
];

const used = new Set();
for (const re of KEY_REGEXES) {
  let m;
  while ((m = re.exec(codeText))) used.add(m[1]);
}

const unused = [];
const namespaces = fs.readdirSync(path.join(LOCALES_DIR, 'en')).filter(f => f.endsWith('.json'));

namespaces.forEach(nsFile => {
  const en = readJson(path.join(LOCALES_DIR, 'en', nsFile));
  const flat = flatten(en);
  Object.keys(flat).forEach(k => {
    const full = `${path.basename(nsFile, '.json')}.${k}`;
    if (!used.has(full)) unused.push(full);
  });
});

if (unused.length) {
  console.warn('⚠️ Unused keys:');
  unused.forEach(k => console.warn(`  - ${k}`));
  process.exitCode = 0; // 경고로 두되, 필요시 1로 바꿔 빌드 막기
} else {
  console.log('✅ No unused keys');
}