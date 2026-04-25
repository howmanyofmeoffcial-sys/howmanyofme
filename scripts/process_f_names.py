import json
import re
import os
import sys

INPUT_FILE = "scripts/raw_names_input_F.txt"
OUTPUT_FILE = "scripts/clean_names_F.json"
DICT_FILE = "/usr/share/dict/words"

# The "Old" F dataset from EXTENDED_NAMES
OLD_F_NAMES = ["Faith", "Felicia", "Felix", "Fernando", "Finn", "Fiona", "Florence", "Floyd", "Frances", "Francis", "Francisco", "Frank", "Franklin", "Fred", "Frederick"]

WHITELIST = set(OLD_F_NAMES)
if os.path.exists("scripts/popular_names_seed.json"):
    with open("scripts/popular_names_seed.json", "r") as f:
        WHITELIST.update(json.load(f))

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
    
    reject_words = lowercase_words - capitalized_words
    return reject_words

def get_gender(name):
    name_lower = name.lower()
    female_suffixes = ("a", "i", "ya", "ah", "ee", "ey", "ie", "elle", "ella", "lyn", "lynn")
    male_suffixes = ("an", "ar", "it", "esh", "on", "en", "er", "or", "us", "os")
    
    if name_lower.endswith(female_suffixes):
        return "female"
    elif name_lower.endswith(male_suffixes):
        return "male"
    else:
        return "unisex"

def process_f_names():
    reject_words = load_dictionary()
    clean_names = {}
    
    seen_names = set()
    seen_slugs = set()
    
    # 1. Global deduplication across all existing core datasets (A-E)
    src_data_dir = "src/data/names"
    if os.path.exists(src_data_dir):
        for filename in os.listdir(src_data_dir):
            if filename.startswith("core_dataset_") and filename.endswith(".json") and filename != "core_dataset_f.json":
                with open(os.path.join(src_data_dir, filename), "r") as f:
                    try:
                        existing_data = json.load(f)
                        for item in existing_data:
                            if "name" in item:
                                seen_names.add(item["name"].lower())
                            if "slug" in item:
                                seen_slugs.add(item["slug"].lower())
                    except Exception as e:
                        print(f"Error loading {filename}: {e}")
                        
    print(f"Loaded {len(seen_names)} existing names for global deduplication (A-E).")
    
    # Track statistics
    total_old = len(OLD_F_NAMES)
    total_new = 0
    duplicates_removed = 0

    def process_name(slug, name):
        nonlocal duplicates_removed
        # Heuristics Validation
        score = 100
        
        if len(slug) < 3:
            return
        if not re.match(r'^[a-z\- ]+$', slug):
            return
        if re.search(r'(.)\1{2,}', slug):
            return
        if not re.search(r'[aeiouy]', slug):
            return
        if re.search(r'[^aeiouy \-]{4,}', slug):
            score -= 20
        if slug in reject_words and name not in WHITELIST:
            return
            
        # Deduplication
        if name.lower() not in seen_names and slug not in seen_slugs:
            if name not in clean_names:
                gender = get_gender(name)
                clean_names[name] = {
                    "name": name,
                    "slug": slug,
                    "gender": gender,
                    "score": score
                }
                seen_names.add(name.lower())
                seen_slugs.add(slug)
        else:
            duplicates_removed += 1

    # 2. Process OLD F names FIRST to give them precedence
    for old_name in OLD_F_NAMES:
        slug = old_name.lower().replace(" ", "-")
        process_name(slug, old_name)

    # 3. Process NEW F names
    with open(INPUT_FILE, 'r') as f:
        lines = f.readlines()
        
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        match = re.search(r'/name/([^/]+)/?', line)
        if not match:
            continue
            
        slug = match.group(1).lower().strip()
        name = slug.replace("-", " ").title()
        total_new += 1
        
        process_name(slug, name)
            
    # Output to JSON
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(list(clean_names.values()), f, indent=2)
        
    print(f"Total Old F Names: {total_old}")
    print(f"Total New F Names: {total_new}")
    print(f"Duplicates Removed: {duplicates_removed}")
    print(f"Final Merged Count: {len(clean_names)}")

if __name__ == "__main__":
    process_f_names()
