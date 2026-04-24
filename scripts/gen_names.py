#!/usr/bin/env python3
"""
Generate the full A-names TypeScript file directly.
Contains all names from aaban through az* with gender detection.
"""
import os, re

KNOWN_MALE = {
    'aaron','adam','adrian','aiden','aidan','alan','albert','alex','alexander',
    'alfred','allen','andrew','anthony','antonio','arthur','austin','axel',
    'ahmad','ahmed','abdul','abdullah','abdel','abdi','abdiel','abner','abe',
    'abel','abraham','abram','ace','adonis','aldo','alden','alfonso','alvin',
    'amos','andre','angelo','arnold','asa','atlas','august','augustus',
    'amir','aryan','aarav','akash','aditya','abhinav','abhishek','ajay',
    'alok','amit','amrit','anand','ashish','ashok','advik','arnav',
    'abbott','aldric','ambrose','anders','anson','archer','arden','ari',
    'arjun','armand','atticus','ayden','advait','atharv','abhay','achilles',
    'adolfo','adolphus','agustin','alaric','alastair','albion','albus',
    'algernon','alistair','amadeus','andreas','angus','ansel','aden','adon',
}
KNOWN_FEMALE = {
    'aaliyah','abigail','ada','adeline','adriana','agatha','agnes','aida',
    'aileen','aimee','ainsley','aisha','alana','alberta','alexa','alexandra',
    'alexis','alice','alicia','alina','alison','allison','alma','amanda',
    'amara','amber','amelia','amy','ana','anastasia','andrea','angela',
    'angelina','anita','ann','anna','anne','annie','april','arabella',
    'ariana','arianna','ariel','arlene','ashley','athena','aubrey','audrey',
    'aurora','autumn','ava','ayesha','azalea','aabha','aadhya','aanya',
    'aarushi','aditi','ananya','anjali','anushka','asha','avni',
    'abbie','abby','adelaide','adele','adrienne','aggie',
    'alessandra','allegra','alyssa','amina','anais','annabelle','annette',
    'antoinette','ariadne','arlette','astrid','augusta','avery',
    'addison','addilyn','adalynn','adalyn',
}

def detect_gender(name):
    n = name.lower()
    if n in KNOWN_MALE: return 'male'
    if n in KNOWN_FEMALE: return 'female'
    for k in KNOWN_MALE:
        if n.startswith(k) and len(n) > len(k) + 2: return 'male'
    for k in KNOWN_FEMALE:
        if n.startswith(k) and len(n) > len(k) + 2: return 'female'
    
    # Strong female endings
    strong_f = ['ella','ette','inna','anna','enna','issa','iella','ielle',
                'ianna','iana','eena','leen','line','lina','rina','dina',
                'tina','nina','mina','gina','isha','esha','asha','usha',
                'ushi','ishi','athi','ithi','itha','iya','aya','eya',
                'iah','yah','nah','rah','lah','mah','dah','tah','kah',
                'sah','zah','wah','fah','ini','ani','eni','uni','oni',
                'ika','aka','uka','eka','oka','ia','ya','ah','ee','ie',
                'na','la','ra','da','sa','ka','ma','ta']
    # Strong male endings
    strong_m = ['ander','andro','ington','iston','eston','mond','mund',
                'bert','ford','rick','wick','drick','trick','fred',
                'helm','olph','ulph','veer','deep','jeet','nath','dev',
                'esh','ish','ush','rit','hit','mit','vit','dit','jit',
                'av','ev','iv','uv','ik','ak','uk','ek','ok']
    
    for s in strong_f:
        if n.endswith(s) and len(n) > len(s): return 'female'
    for s in strong_m:
        if n.endswith(s) and len(n) > len(s): return 'male'
    
    # Ambiguous endings - use common patterns
    if n.endswith('a') or n.endswith('i'): return 'female'
    if n.endswith('n') or n.endswith('r') or n.endswith('d') or n.endswith('s'): return 'male'
    if n.endswith('o') or n.endswith('x'): return 'male'
    return 'unisex'

# Read the full name list from the companion file
script_dir = os.path.dirname(os.path.abspath(__file__))
names_file = os.path.join(script_dir, 'a_names_full.txt')

if not os.path.exists(names_file):
    print(f"ERROR: {names_file} not found. Creating placeholder.")
    # Generate a comprehensive A-names list from common patterns
    exit(1)

with open(names_file) as f:
    raw_names = [line.strip().lower() for line in f if line.strip()]

# Deduplicate
seen = set()
unique = []
for n in raw_names:
    if n not in seen and len(n) > 1:
        seen.add(n)
        unique.append(n)

# Generate TypeScript
cap = lambda n: n[0].upper() + n[1:]
entries = [f'  {{ name: "{cap(n)}", gender: "{detect_gender(n)}" }}' for n in unique]

output = f"""// Auto-generated: {len(entries)} names starting with A
// Gender detected via suffix heuristics + known-name matching

export type NameEntry = {{ name: string; gender: 'male' | 'female' | 'unisex' }};

export const A_NAMES: NameEntry[] = [
{(","+chr(10)).join(entries)}
];
"""

outdir = os.path.join(script_dir, '..', 'src', 'data', 'names')
os.makedirs(outdir, exist_ok=True)
outpath = os.path.join(outdir, 'namesA.ts')
with open(outpath, 'w') as f:
    f.write(output)

genders = {'male': 0, 'female': 0, 'unisex': 0}
for n in unique:
    genders[detect_gender(n)] += 1
print(f"Generated {len(entries)} entries -> {outpath}")
print(f"Gender breakdown: {genders}")
