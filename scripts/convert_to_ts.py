import json
import os
import sys

if len(sys.argv) < 2:
    print("Usage: python convert_to_ts.py [A|B]")
    sys.exit(1)

letter = sys.argv[1].upper()
letter_lower = letter.lower()

scored_file = f"scripts/scored_names_{letter}.json" if letter == "B" else f"scripts/scored_names.json"
if not os.path.exists(scored_file):
    print(f"File not found: {scored_file}")
    sys.exit(1)

with open(scored_file, "r") as f:
    data = json.load(f)

# Load tiers
tiers_file = f"scripts/top_500_tiers_{letter}.json" if letter == "B" else f"scripts/top_500_tiers.json"
tier1, tier2, tier3 = set(), set(), set()
if os.path.exists(tiers_file):
    with open(tiers_file, "r") as f:
        tiers = json.load(f)
        tier1 = set(tiers.get("tier1", []))
        tier2 = set(tiers.get("tier2", []))
        tier3 = set(tiers.get("tier3", []))

top_300 = tier1.union(tier2).union(tier3) # Actually this is top 500, let's keep all 500 in TS, or strictly 300?
# The user asked for "Top 100-300 names". Let's restrict to tier1 and tier2 (300 names max).
top_300 = tier1.union(tier2)

ts_lines = []
extended_json_data = []

for item in data:
    name = item["name"].replace('"', '\\"')
    gender = item["gender"]
    score = item["score"]
    status = item["status"]
    
    tier = "null"
    if name in tier1: tier = "1"
    elif name in tier2: tier = "2"
    elif name in tier3: tier = "3"
    
    entry_str = f'  {{ name: "{name}", gender: "{gender}", score: {score}, status: "{status}", tier: {tier} }}'
    
    # If it's in top 300, it goes to TS file. Otherwise it goes to JSON.
    if name in top_300:
        ts_lines.append(entry_str)
    else:
        # Keep it in extended JSON if valid
        extended_json_data.append({
            "name": item["name"],
            "gender": gender,
            "score": score,
            "status": status,
            "tier": int(tier) if tier != "null" else None
        })

ts_content = f"""export type NameEntry = {{ 
  name: string; 
  gender: "male" | "female" | "unisex";
  score: number;
  status: "index" | "noindex" | "review" | "reject";
  tier: 1 | 2 | 3 | null;
}};
export const {letter}_NAMES: NameEntry[] = [
""" + ",\n".join(ts_lines) + "\n];\n"

with open(f"src/data/names/names{letter}.ts", "w") as f:
    f.write(ts_content)

with open(f"src/data/names/extended_{letter_lower}.json", "w") as f:
    json.dump(extended_json_data, f, indent=2)

print(f"Wrote {len(ts_lines)} high-priority items to names{letter}.ts")
print(f"Wrote {len(extended_json_data)} extended items to extended_{letter_lower}.json")
