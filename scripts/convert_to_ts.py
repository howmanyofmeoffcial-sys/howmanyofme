import json
import os

with open("scripts/scored_names_B.json", "r") as f:
    data = json.load(f)

# Optional: load tiers
tier1, tier2, tier3 = set(), set(), set()
if os.path.exists("scripts/top_500_tiers_B.json"):
    with open("scripts/top_500_tiers_B.json", "r") as f:
        tiers = json.load(f)
        tier1 = set(tiers.get("tier1", []))
        tier2 = set(tiers.get("tier2", []))
        tier3 = set(tiers.get("tier3", []))

ts_lines = []
for item in data:
    name = item["name"].replace('"', '\\"')
    gender = item["gender"]
    score = item["score"]
    status = item["status"]
    
    tier = "null"
    if name in tier1: tier = "1"
    elif name in tier2: tier = "2"
    elif name in tier3: tier = "3"
    
    ts_lines.append(f'  {{ name: "{name}", gender: "{gender}", score: {score}, status: "{status}", tier: {tier} }}')

ts_content = """export type NameEntry = { 
  name: string; 
  gender: "male" | "female" | "unisex";
  score: number;
  status: "index" | "noindex" | "review" | "reject";
  tier: 1 | 2 | 3 | null;
};
export const B_NAMES: NameEntry[] = [
""" + ",\n".join(ts_lines) + "\n];\n"

with open("src/data/names/namesB.ts", "w") as f:
    f.write(ts_content)

print(f"Wrote {len(data)} items to namesB.ts")
