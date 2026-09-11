const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '..', 'frontend', 'src', 'locales');
const enPath = path.join(localesDir, 'en.json');
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const k in obj) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      keys = keys.concat(getAllKeys(obj[k], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

const enKeys = getAllKeys(en);
console.log(`Base English Schema has ${enKeys.length} total keys.`);

const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));
let allValid = true;

files.forEach(file => {
  const filePath = path.join(localesDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const fileKeys = getAllKeys(data);

  const missingKeys = enKeys.filter(k => !fileKeys.includes(k));
  if (missingKeys.length > 0) {
    console.error(`❌ ${file} is missing ${missingKeys.length} keys:`, missingKeys.slice(0, 5));
    allValid = false;
  } else {
    console.log(`✅ ${file}: 100% key match (${fileKeys.length} keys)`);
  }
});

if (allValid) {
  console.log('\n🎉 ALL 20 LOCALE FILES HAVE 100% KEY MATCH WITH ZERO GAPS!');
} else {
  process.exit(1);
}
