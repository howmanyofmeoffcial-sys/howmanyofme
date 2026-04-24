import json

with open("scripts/clean_names.json", "r") as f:
    data = json.load(f)

ts_lines = []
for item in data:
    name = item["name"].replace('"', '\\"')
    gender = item["gender"]
    ts_lines.append(f'  {{ name: "{name}", gender: "{gender}" }}')

ts_content = "export type NameEntry = { name: string; gender: \"male\" | \"female\" | \"unisex\" };\nexport const A_NAMES: NameEntry[] = [\n" + ",\n".join(ts_lines) + "\n];\n"

with open("src/data/names/namesA.ts", "w") as f:
    f.write(ts_content)

print(f"Wrote {len(data)} items to namesA.ts")
