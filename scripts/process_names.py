import json
import re
import os

import sys

letter = sys.argv[1].upper() if len(sys.argv) > 1 else "B"
INPUT_FILE = f"scripts/raw_names_input_{letter}.txt" if letter == "B" else f"scripts/raw_names_input.txt"
OUTPUT_FILE = f"scripts/clean_names_{letter}.json" if letter == "B" else f"scripts/clean_names.json"
DICT_FILE = "/usr/share/dict/words"

# Load dynamic known popular names for similarity checking and whitelist
WHITELIST = set()
if os.path.exists("scripts/popular_names_seed.json"):
    with open("scripts/popular_names_seed.json", "r") as f:
        WHITELIST = set(json.load(f))

def load_dictionary():
    lowercase_words = set()
    capitalized_words = set()
    if os.path.exists(DICT_FILE):
        with open(DICT_FILE, 'r') as f:
            for line in f:
                word = line.strip()
                if word.islower():
                    lowercase_words.add(word)
                elif word.istitle():
                    capitalized_words.add(word.lower())
    
    # Words to reject: they exist as generic lowercase words but NOT as proper nouns
    # And they are not in our whitelist
    reject_words = lowercase_words - capitalized_words
    return reject_words

def get_gender(name):
    # Heuristics for gender based on suffix
    name_lower = name.lower()
    female_suffixes = ("a", "i", "ya", "ah", "ee", "ey", "ie", "elle", "ella", "lyn", "lynn")
    male_suffixes = ("an", "ar", "it", "esh", "on", "en", "er", "or", "us", "os")
    
    if name_lower.endswith(female_suffixes):
        return "female"
    elif name_lower.endswith(male_suffixes):
        return "male"
    else:
        return "unisex"

def process_names():
    reject_words = load_dictionary()
    clean_names = {}
    
    with open(INPUT_FILE, 'r') as f:
        lines = f.readlines()
        
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Extract slug from URL like /name/aaban/
        match = re.search(r'/name/([^/]+)/?', line)
        if not match:
            continue
            
        slug = match.group(1).lower().strip()
        name = slug.replace("-", " ").title()
        
        # Heuristics Validation
        score = 100
        
        # 1. Too short
        if len(slug) < 3:
            continue
            
        # 2. Non-alphabetical (allow spaces and hyphens)
        if not re.match(r'^[a-z\- ]+$', slug):
            continue
            
        # 3. Excessive repeated chars (e.g. 'aaaa')
        if re.search(r'(.)\1{2,}', slug):
            continue
            
        # 4. Must contain at least one vowel
        if not re.search(r'[aeiouy]', slug):
            continue
            
        # 5. Excessive consonants (4 or more in a row)
        if re.search(r'[^aeiouy \-]{4,}', slug):
            score -= 20
            
        # 6. Dictionary word filter
        # If it's a generic word, reject it
        if slug in reject_words and slug not in WHITELIST:
            # Common dictionary word that's not a known name
            continue
            
        if score < 80:
            continue
            
        # Deduplication
        if name not in clean_names:
            gender = get_gender(name)
            clean_names[name] = {
                "name": name,
                "slug": slug,
                "gender": gender,
                "score": score
            }
            
    # Output to JSON
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(list(clean_names.values()), f, indent=2)
        
    print(f"Processed {len(lines)} URLs.")
    print(f"Extracted {len(clean_names)} clean names.")

if __name__ == "__main__":
    process_names()
