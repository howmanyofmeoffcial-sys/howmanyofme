import json

INPUT_FILE = "scripts/scored_names_B.json"
OUTPUT_FILE = "scripts/top_500_tiers_B.json"

# Basic list of top names to seed the tier selection
TOP_NAMES_SEED = {
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
    "bree", "brooklyn", "brooke", "brynn", "blair", "bianca", "bonnie"
}

def prioritize_names():
    with open(INPUT_FILE, "r") as f:
        data = json.load(f)
        
    # Filter only names that have a high enough score to be considered (index or review)
    # The prompt explicitly requires "Score >= 80: index", so ideally we only pick index.
    valid_names = [x for x in data if x["score"] >= 80]
    
    # Sort primarily by score, secondary by length (prefer 4-7 chars)
    # We add a slight boost to known top names to ensure they get picked first
    for n in valid_names:
        n["priority_score"] = n["score"]
        if n["slug"] in TOP_NAMES_SEED:
            n["priority_score"] += 50
        elif 4 <= len(n["slug"]) <= 7:
            n["priority_score"] += 10
            
    valid_names.sort(key=lambda x: x["priority_score"], reverse=True)
    
    tier1 = []
    tier2 = []
    tier3 = []
    
    # Tier 1 (Top 100): most common base names (perfect score + seed priority)
    for n in valid_names:
        if len(tier1) < 100:
            tier1.append(n["name"])
        else:
            break
            
    used = set(tier1)
    
    # Tier 2 (Next 200): variations or slightly lower priority but standard names
    for n in valid_names:
        if len(tier2) < 200 and n["name"] not in used:
            # simple heuristic for variations: same prefix or common suffix
            tier2.append(n["name"])
            used.add(n["name"])
            
    # Tier 3 (Next 200): long-tail combinations
    for n in valid_names:
        if len(tier3) < 200 and n["name"] not in used:
            # pick longer names (8+ chars) for long-tail, or just the next best
            if len(n["slug"]) >= 7:
                tier3.append(n["name"])
                used.add(n["name"])
                
    # Fill any remaining slots in Tier 3 if long-tail heuristic didn't find enough
    for n in valid_names:
        if len(tier3) < 200 and n["name"] not in used:
            tier3.append(n["name"])
            used.add(n["name"])
            
    output = {
        "tier1": tier1,
        "tier2": tier2,
        "tier3": tier3
    }
    
    with open(OUTPUT_FILE, "w") as f:
        json.dump(output, f, indent=2)
        
    print(f"Selected {len(tier1)} Tier 1, {len(tier2)} Tier 2, {len(tier3)} Tier 3 names.")

if __name__ == "__main__":
    prioritize_names()
