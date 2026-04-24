#!/usr/bin/env python3
"""
Build namesA.ts - reads URLs from a_names_full.txt (one name per line or one URL per line).
If the file doesn't exist or is small, prints instructions.
Usage: paste all URLs into scripts/a_names_full.txt, then run this script.
"""
import re, os, sys

KNOWN_MALE = {'aaron','adam','adrian','aiden','aidan','alan','albert','alex','alexander',
    'alfred','allen','andrew','anthony','antonio','arthur','austin','axel','ahmad','ahmed',
    'abdul','abdullah','abner','abe','abel','abraham','abram','ace','adonis','aldo','alden',
    'alfonso','alvin','amos','andre','angelo','arnold','asa','atlas','august','amir','aryan',
    'aarav','akash','aditya','abhinav','abhishek','ajay','amit','anand','ashok','advik','arnav',
    'abbott','ambrose','anders','anson','archer','arden','ari','arjun','armand','ayden','advait',
    'achilles','agustin','alaric','alastair','alistair','aden','adon','abdiel','abdi'}
KNOWN_FEMALE = {'aaliyah','abigail','ada','adeline','adriana','agatha','agnes','aida','aileen',
    'aimee','ainsley','aisha','alana','alexa','alexandra','alexis','alice','alicia','alina',
    'alison','allison','alma','amanda','amara','amber','amelia','amy','ana','anastasia','andrea',
    'angela','angelina','anita','ann','anna','anne','annie','april','arabella','ariana','arianna',
    'ariel','arlene','ashley','athena','aubrey','audrey','aurora','autumn','ava','ayesha','azalea',
    'aadhya','aanya','aarushi','aditi','ananya','anjali','anushka','asha','avni','abbie','abby',
    'adelaide','adele','adrienne','alessandra','allegra','alyssa','amina','annabelle','astrid',
    'augusta','avery','addison','adalynn','adalyn'}

def detect_gender(name):
    n = name.lower()
    if n in KNOWN_MALE: return 'male'
    if n in KNOWN_FEMALE: return 'female'
    for k in KNOWN_MALE:
        if n.startswith(k) and len(n) > len(k)+2: return 'male'
    for k in KNOWN_FEMALE:
        if n.startswith(k) and len(n) > len(k)+2: return 'female'
    sf = ['ella','ette','inna','anna','enna','issa','iella','ielle','ianna','iana','eena',
          'leen','line','lina','rina','dina','tina','nina','mina','gina','isha','esha','asha',
          'usha','ushi','ishi','athi','ithi','itha','iya','aya','eya','iah','yah','nah','rah',
          'lah','mah','dah','tah','kah','sah','zah','ini','ani','eni','uni','oni','ika','ia','ya','ah','ee','ie',
          'na','la','ra','da','sa','ka','ma','ta']
    sm = ['ander','andro','bert','ford','rick','wick','drick','fred','helm','olph',
          'veer','deep','jeet','nath','dev','esh','ish','ush','rit','hit','mit','vit',
          'dit','jit','av','ev','iv','uv','ik','ak','uk','ek','ok']
    for s in sf:
        if n.endswith(s) and len(n)>len(s): return 'female'
    for s in sm:
        if n.endswith(s) and len(n)>len(s): return 'male'
    if n.endswith('a') or n.endswith('i'): return 'female'
    if n.endswith(('n','r','d','s','o','x')): return 'male'
    return 'unisex'

script_dir = os.path.dirname(os.path.abspath(__file__))
infile = os.path.join(script_dir, 'a_names_full.txt')

if not os.path.exists(infile) or os.path.getsize(infile) < 100:
    print(f"Please paste all name URLs (one per line) into:\n  {infile}")
    print("Then re-run this script.")
    sys.exit(1)

with open(infile) as f:
    raw = f.read()

# Extract names from URLs or plain text
names = []
for line in raw.strip().split('\n'):
    line = line.strip()
    m = re.search(r'/name/([a-zA-Z]+)', line)
    if m:
        names.append(m.group(1).lower())
    elif re.match(r'^[a-zA-Z]+$', line) and len(line) > 1:
        names.append(line.lower())

seen = set(); unique = []
for n in names:
    if n not in seen:
        seen.add(n); unique.append(n)

cap = lambda n: n[0].upper()+n[1:]
lines = [f'  {{ name: "{cap(n)}", gender: "{detect_gender(n)}" }}' for n in unique]
ts = f'''// Auto-generated: {len(lines)} names starting with A
export type NameEntry = {{ name: string; gender: "male" | "female" | "unisex" }};
export const A_NAMES: NameEntry[] = [\n''' + ',\n'.join(lines) + '\n];\n'

outdir = os.path.join(script_dir,'..','src','data','names')
os.makedirs(outdir, exist_ok=True)
out = os.path.join(outdir,'namesA.ts')
with open(out,'w') as f: f.write(ts)

g = {'male':0,'female':0,'unisex':0}
for n in unique: g[detect_gender(n)] += 1
print(f"✓ Generated {len(lines)} entries -> src/data/names/namesA.ts")
print(f"  Gender: {g}")
