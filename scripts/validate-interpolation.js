// node scripts/validate-interpolation.js
const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.resolve('src/locales');
const LOCALES = ['en', 'ko'];
const ELLIPSIS = '…'; // 단일 문자

function flatten(obj, prefix = '', out = {}) {
  Object.entries(obj || {}).forEach(([k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v, key, out);
    else out[key] = String(v);
  });
  return out;
}

function placeholders(s) {
  const set = new Set();
  const re = /\{(\w+)\}/g;
  let m; while ((m = re.exec(s))) set.add(m[1]);
  return set;
}

function readNS(locale, nsFile) {
  const p = path.join(LOCALES_DIR, locale, nsFile);
  return flatten(JSON.parse(fs.readFileSync(p, 'utf8')));
}

let error = false;
const namespaces = fs.readdirSync(path.join(LOCALES_DIR, 'en')).filter(f => f.endsWith('.json'));

namespaces.forEach(nsFile => {
  const maps = Object.fromEntries(LOCALES.map(l => [l, readNS(l, nsFile)]));
  const keys = new Set(Object.keys(maps.en));

  keys.forEach(k => {
    const base = maps.en[k];
    const basePH = placeholders(base);
    for (const l of LOCALES) {
      const val = maps[l][k];
      if (val == null) continue;
      // 1) placeholder 집합 일치
      const ph = placeholders(val);
      const diff1 = [...basePH].filter(x => !ph.has(x));
      const diff2 = [...ph].filter(x => !basePH.has(x));
      if (diff1.length || diff2.length) {
        error = true;
        console.error(`❌ Placeholder mismatch in ${l}/${nsFile}:${k}  (en=${[...basePH]}, ${l}=${[...ph]})`);
      }
      // 2) 버튼/액션 문구 규칙: 마침표 금지
      if (/\.actions\./.test(k)) {
        if (/[.!?]\s*$/.test(val)) {
          error = true;
          console.error(`❌ Trailing punctuation in action: ${l}/${nsFile}:${k} -> "${val}"`);
        }
      }
      // 3) 로딩/진행형은 단일 ellipsis 강제
      if (/(\.state\.|\.actions\.saving|\.state\.loading)/.test(k)) {
        if (val.includes('...')) {
          error = true;
          console.error(`❌ Use single ellipsis "${ELLIPSIS}" instead of "..." in ${l}/${nsFile}:${k}`);
        }
      }
    }
  });
});

if (error) process.exit(1);
console.log('✅ Interpolation & style validation OK');