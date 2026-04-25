import json
import re
import difflib
import os

INPUT_FILE = "scripts/clean_names_B.json"
OUTPUT_FILE = "scripts/scored_names_B.json"
DICT_FILE = "/usr/share/dict/words"

# Base known popular names for similarity checking (sample)
KNOWN_POPULAR = {
    "aaron", "abigail", "adam", "adrian", "aiden", "alan", "albert", "alex", 
    "alexander", "alexis", "alice", "alicia", "alison", "allison", "alma", 
    "amanda", "amber", "amelia", "amy", "ana", "andrea", "andrew", "angela", 
    "angelina", "anita", "ann", "anna", "anne", "annie", "anthony", "antonio", 
    "april", "ariana", "arianna", "ariel", "arthur", "ashley", "athena", "aubrey", 
    "audrey", "august", "aurora", "austin", "autumn", "ava", "axel", "aarav", 
    "aaliyah", "amir", "aryan", "ayden", "alden", "amara",
    "benjamin", "bella", "brianna", "brandon", "brian", "bailey", "blake",
    "brody", "bentley", "braxton", "bryce", "bradley", "brooks", "bryan",
    "beau", "beckett", "brady", "beckham", "brendan", "brennan", "ben",
    "bill", "billy", "beth", "bethany", "britney", "brittany", "brie",
    "bree", "brooklyn", "brooke", "brynn", "blair", "bianca", "bonnie",
    "beatrice", "bristol", "bailee", "braelyn", "bridget"
}

def load_dictionary():
    words = set()
    if os.path.exists(DICT_FILE):
        with open(DICT_FILE, 'r') as f:
            for line in f:
                word = line.strip().lower()
                words.add(word)
    return words

def get_similarity_score(name):
    name_lower = name.lower()
    if name_lower in KNOWN_POPULAR:
        return 20
        
    best_ratio = 0
    for known in KNOWN_POPULAR:
        ratio = difflib.SequenceMatcher(None, name_lower, known).ratio()
        if ratio > best_ratio:
            best_ratio = ratio
            
    if best_ratio > 0.8:
        return 20 # Close match
    elif best_ratio > 0.6:
        return 10 # Weak match
    else:
        return 0 # No match

def score_name(item, dict_words):
    name = item["name"]
    slug = item["slug"]
    
    score = 0
    
    # A. Name Validity (0-30)
    # Check for numbers, weird symbols
    if re.match(r'^[a-zA-Z\s\-]+$', name):
        if re.search(r'(.)\1{2,}', slug): # suspicious e.g., 'aaa'
            score += 5
        elif re.search(r'^[^aeiouy]+$|^[aeiouy]+$', slug): # all vowels or all consonants
            score += 5
        elif len(slug) < 3:
            score += 5
        else:
            score += 30 # standard valid pattern
    else:
        score += 5
        
    # B. Pronounceability (0-20)
    consecutive_consonants = max([len(x) for x in re.findall(r'[^aeiouy\s\-]+', slug)] + [0])
    consecutive_vowels = max([len(x) for x in re.findall(r'[aeiouy]+', slug)] + [0])
    
    if consecutive_consonants >= 4 or consecutive_vowels >= 4:
        score += 0 # difficult
    elif consecutive_consonants == 3 or consecutive_vowels == 3:
        score += 10 # moderate
    else:
        score += 20 # easy
        
    # C. Similarity to Known Names (0-20)
    score += get_similarity_score(slug)
    
    # D. Length Quality (0-10)
    length = len(slug)
    if 4 <= length <= 8:
        score += 10
    elif length == 3 or length == 9 or length == 10:
        score += 5
    else:
        score += 0
        
    # E. Non-Dictionary Check (0-10)
    if slug in dict_words:
        if slug in KNOWN_POPULAR:
            score += 5 # ambiguous (e.g., 'amber')
        else:
            score += 0 # common word
    else:
        score += 10 # not a word
        
    # F. Cultural Pattern Match (0-10)
    suffixes = ('a', 'ah', 'ia', 'ka', 'on', 'an', 'en', 'el', 'us', 'os', 'in')
    if slug.endswith(suffixes):
        score += 10
    elif slug.endswith(('y', 'ee', 'ie', 'lyn', 'lynn', 'son', 'ton')):
        score += 10
    else:
        score += 5 # unclear
        
    # Cap at 100
    score = min(100, score)
    
    # Decision Logic
    if score >= 80:
        status = "index"
    elif 60 <= score <= 79:
        status = "review"
    elif 40 <= score < 60:
        status = "noindex"
    else:
        status = "reject"
        
    return {
        "name": name,
        "slug": slug,
        "gender": item["gender"],
        "score": score,
        "status": status
    }

def main():
    dict_words = load_dictionary()
    
    with open(INPUT_FILE, "r") as f:
        data = json.load(f)
        
    scored_data = []
    for item in data:
        scored = score_name(item, dict_words)
        # Drop rejected names from further processing or keep them with "reject" status
        scored_data.append(scored)
        
    # Print an example requested by user
    example = next((x for x in scored_data if x["slug"] == "aarav"), None)
    if example:
        print(json.dumps({"name": example["name"], "score": example["score"], "status": example["status"]}, indent=2))
        
    with open(OUTPUT_FILE, "w") as f:
        json.dump(scored_data, f, indent=2)
        
    print(f"Scored {len(scored_data)} names.")

if __name__ == "__main__":
    main()
