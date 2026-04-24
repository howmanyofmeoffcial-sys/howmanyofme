#!/usr/bin/env node
/**
 * Generates src/data/names/namesA.ts from the URL list.
 * Gender detection uses suffix heuristics + known-name matching.
 */
const fs = require('fs');
const path = require('path');

// Read the URL list from stdin or hardcoded file
const urlListPath = path.join(__dirname, 'a_names_urls.txt');
const raw = fs.readFileSync(urlListPath, 'utf-8');

const names = raw
  .split('\n')
  .map(line => line.trim())
  .filter(Boolean)
  .map(url => {
    const match = url.match(/\/name\/([^/]+)\/?$/);
    return match ? match[1].toLowerCase().trim() : null;
  })
  .filter(Boolean)
  .filter(n => n.length > 1 && !n.includes(' '));

// Known male/female name stems for better detection
const KNOWN_MALE = new Set([
  'aaron','adam','adrian','aiden','aidan','alan','albert','alex','alexander',
  'alfred','allen','andrew','anthony','antonio','arthur','austin','axel',
  'ahmad','ahmed','abdul','abdullah','abdel','abdi','abdiel','abner','abe',
  'abel','abraham','abram','ace','adonis','aldo','alden','aldric','alfonso',
  'alvin','ambrose','amos','anders','andre','angelo','anson','archer','arden',
  'ari','arjun','armand','arnold','asa','ashton','atlas','atticus','august',
  'augustus','avery','axel','ayden','amir','aryan','advait','aarav','arjun',
  'akash','aditya','abhinav','abhishek','ajay','alok','amit','amrit','anand',
  'ankur','anurag','ashish','ashok','atharv','advik','arnav'
]);
const KNOWN_FEMALE = new Set([
  'aaliyah','abigail','ada','adeline','adriana','agatha','agnes','aida',
  'aileen','aimee','ainsley','aisha','alana','alberta','alexa','alexandra',
  'alexis','alice','alicia','alina','alison','allison','alma','amanda',
  'amara','amber','amelia','amy','ana','anastasia','andrea','angela','angelina',
  'anita','ann','anna','anne','annie','april','arabella','ariana','arianna',
  'ariel','arlene','ashley','athena','aubrey','audrey','aurora','autumn',
  'ava','avery','ayesha','azalea','aabha','aadhya','aanya','aarushi','aditi',
  'ananya','anjali','anushka','asha','ashwini','avni'
]);

function detectGender(name) {
  const n = name.toLowerCase();
  
  // Check known lists first
  for (const k of KNOWN_MALE) {
    if (n === k) return 'male';
  }
  for (const k of KNOWN_FEMALE) {
    if (n === k) return 'female';
  }
  
  // Compound name patterns (e.g., aaronjames -> male)
  for (const k of KNOWN_MALE) {
    if (n.startsWith(k) && n.length > k.length + 2) return 'male';
  }
  for (const k of KNOWN_FEMALE) {
    if (n.startsWith(k) && n.length > k.length + 2) return 'female';
  }

  // Female suffix patterns (most specific first)
  const femaleSuffixes = [
    'ella','ella','ette','inna','anna','enna','issa','issa','iella',
    'ielle','ianna','iana','eena','eena','leen','line','lina','rina',
    'dina','tina','nina','mina','gina','isha','isha','esha','asha',
    'usha','ushi','ishi','oshi','athi','ithi','itha','itha',
    'iya','aya','eya','oya','uya','iah','yah','nah','rah','lah','mah',
    'dah','tah','kah','sah','zah','wah','fah','jah','bah',
    'ini','ani','eni','uni','oni','iki','aki','uki',
    'ika','aka','uka','eka','oka',
    'ia','ya','ah','ee','ie','na','la','ra','da','sa','ka','ma','ta',
    'ey','ly','ny','ry','sy','zy',
    'a','i'
  ];
  
  // Male suffix patterns
  const maleSuffixes = [
    'ander','ander','andro','ington','iston','eston',
    'mond','mund','wald','ward','bert','ford','rick','wick',
    'drick','trick','fred','frid','helm','olph','ulph',
    'shan','khan','shan','veer','deep','jeet','nath','dev',
    'esh','ish','ush','ash','osh',
    'rit','hit','mit','vit','dit','jit','git','bit','pit','sit','kit',
    'av','ev','iv','uv',
    'ik','ak','uk','ek','ok',
    'an','en','in','on','un',
    'ar','er','ir','or','ur',
    'ad','ed','id','od','ud',
    'am','em','im','om','um',
    'al','el','il','ol','ul',
    'af','ef','if','of','uf',
    'az','ez','iz','oz','uz',
    'ax','ex','ix','ox','ux',
    'ab','eb','ib','ob','ub',
    'us','os','is'
  ];

  // Check female suffixes first (they're more distinctive)
  for (const s of femaleSuffixes) {
    if (n.endsWith(s) && n.length > s.length) {
      // Some suffixes are ambiguous - check male overrides
      if (['an','in','on','en','ar','er','ir','or','ur','al','el','il','ol','ul',
           'am','em','im','om','um','ad','ed','id','od','ud','is','us','os'].includes(s)) {
        continue; // skip ambiguous single suffixes for female
      }
      return 'female';
    }
  }
  
  for (const s of maleSuffixes) {
    if (n.endsWith(s) && n.length > s.length) {
      return 'male';
    }
  }

  return 'unisex';
}

// Capitalize name
function capitalize(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

// Generate output
const entries = [...new Set(names)].map(n => {
  const gender = detectGender(n);
  return `  { name: "${capitalize(n)}", gender: "${gender}" }`;
});

const output = `// Auto-generated: ${entries.length} names starting with A
// Gender detected via suffix heuristics + known-name matching

export type NameEntry = { name: string; gender: 'male' | 'female' | 'unisex' };

export const A_NAMES: NameEntry[] = [
${entries.join(',\n')}
];
`;

const outDir = path.join(__dirname, '..', 'src', 'data', 'names');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'namesA.ts'), output);

console.log(`Generated ${entries.length} name entries in src/data/names/namesA.ts`);
