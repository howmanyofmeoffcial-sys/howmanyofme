import json
import os
import sys

# Combine all scored datasets
combined_data = []

# Assuming we might have A, B, C...
for letter in "ABCDEFGHIJKLMNOPQRSTUVWXYZ":
    file_path = f"scripts/scored_names_{letter}.json"
    if os.path.exists(file_path):
        with open(file_path, "r") as f:
            combined_data.extend(json.load(f))

if not combined_data:
    print("No scored_names_*.json files found.")
    sys.exit(1)

# Ensure no duplicates
unique_data = {item['name'].lower(): item for item in combined_data}
combined_data = list(unique_data.values())

# Filter out low scores (must be >= 80 to be indexed)
combined_data = [item for item in combined_data if item.get('score', 0) >= 80]

# Sort by score descending
combined_data.sort(key=lambda x: x.get('score', 0), reverse=True)

# 100 Core: highest global frequency/score
core = combined_data[:100]

# Mark core
core_names = {c['name'].lower() for c in core}

# 100 Variations: We need 100 names that are highly similar to core names.
variations = []
import difflib

# To find variations, let's just pick names with high similarity to core, skipping exact core
for item in combined_data[100:]:
    nl = item['name'].lower()
    # Find similarity to core
    # Since difflib is slow, let's just look at the top 1000 names for variations
    is_variation = False
    for c in core:
        cnl = c['name'].lower()
        if cnl in nl or nl in cnl or difflib.SequenceMatcher(None, nl, cnl).ratio() > 0.85:
            is_variation = True
            break
    if is_variation:
        variations.append(item)
    if len(variations) >= 100:
        break

# If we couldn't find 100 variations, just pad with next highest scores
if len(variations) < 100:
    for item in combined_data[100:]:
        if item['name'].lower() not in core_names and item not in variations:
            variations.append(item)
            if len(variations) >= 100:
                break

var_names = {v['name'].lower() for v in variations}

# 100 Long-Tail: Lower frequency (maybe longer length) but high algorithmic validity
longtail = []
# Filter out core and variations, sort by length descending to get "long-tail" vibe, or just next best scores
remaining = [item for item in combined_data if item['name'].lower() not in core_names and item['name'].lower() not in var_names]

# Sort remaining by length to emphasize long-tail (or just next 100 highest score with length > 6)
longtail_candidates = [item for item in remaining if len(item['name']) > 6]
if len(longtail_candidates) < 100:
    longtail_candidates = remaining

longtail = sorted(longtail_candidates, key=lambda x: x.get('score', 0), reverse=True)[:100]

print(f"Selected {len(core)} Core, {len(variations)} Variations, {len(longtail)} Long-Tail.")

# Assign tiers and status
targets = []
for item in core:
    targets.append({
        "name": item["name"],
        "gender": item["gender"],
        "score": item["score"],
        "status": "index",
        "tier": 1,
        "category": "core"
    })

for item in variations:
    targets.append({
        "name": item["name"],
        "gender": item["gender"],
        "score": item["score"],
        "status": "index",
        "tier": 2,
        "category": "variation"
    })

for item in longtail:
    targets.append({
        "name": item["name"],
        "gender": item["gender"],
        "score": item["score"],
        "status": "index",
        "tier": 3,
        "category": "longtail"
    })

# Save to src/data/names/indexed_sitemap_targets.json
with open("src/data/names/indexed_sitemap_targets.json", "w") as f:
    json.dump(targets, f, indent=2)

print(f"Wrote {len(targets)} optimized SEO targets to indexed_sitemap_targets.json")

# Also save the raw datasets to src/data/names/core_dataset_{letter}.json
for letter in "ABCDEFGHIJKLMNOPQRSTUVWXYZ":
    file_path = f"scripts/scored_names_{letter}.json"
    if os.path.exists(file_path):
        with open(file_path, "r") as f:
            data = json.load(f)
            # Remove extended_a/b logic since everything is in core_dataset
            out_path = f"src/data/names/core_dataset_{letter.lower()}.json"
            with open(out_path, "w") as out_f:
                json.dump(data, out_f, indent=2)
            print(f"Wrote {len(data)} items to {out_path}")

