import fs from 'fs';
import path from 'path';

export function getNamesForLetterServer(letter: string, baseNames: string[]): string[] {
  const letterLower = letter.toLowerCase();
  
  if (letterLower === 'a' || letterLower === 'b') {
    try {
      const filePath = path.join(process.cwd(), 'src', 'data', 'names', `core_dataset_${letterLower}.json`);
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const coreNames = JSON.parse(fileContent);
        return [...baseNames, ...coreNames.map((n: any) => n.name)];
      }
    } catch (e) {
      console.error(e);
    }
  }
  
  return baseNames;
}

export function getRegistryStatus(name: string): { status: string, score: number, tier: number | null } | null {
  const nl = name.toLowerCase();
  const letter = nl.charAt(0);
  
  // 1. Check if it's in the indexed sitemap targets (Top 300)
  try {
    const targetsPath = path.join(process.cwd(), 'src', 'data', 'names', 'indexed_sitemap_targets.json');
    if (fs.existsSync(targetsPath)) {
      const fileContent = fs.readFileSync(targetsPath, 'utf-8');
      const targets = JSON.parse(fileContent);
      const match = targets.find((n: any) => n.name.toLowerCase() === nl);
      if (match) return { status: match.status, score: match.score, tier: match.tier };
    }
  } catch (e) {
    console.error(e);
  }

  // 2. If not in the Top 300, check the full core dataset for the score
  if (letter === 'a' || letter === 'b') {
    try {
      const filePath = path.join(process.cwd(), 'src', 'data', 'names', `core_dataset_${letter}.json`);
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const coreNames = JSON.parse(fileContent);
        const match = coreNames.find((n: any) => n.name.toLowerCase() === nl);
        if (match) {
            // Even if valid, if it's not in our indexed sitemap targets, we might enforce noindex
            // But we allow rendering if score >= 60. 
            // Let's return noindex for any non-top-300 page to be perfectly strict.
            return { status: "noindex", score: match.score, tier: null };
        }
      }
    } catch (e) {
      console.error(e);
    }
    
    return { status: "reject", score: 0, tier: null };
  }
  
  return null;
}

export function getIndexedSitemapTargets() {
    try {
        const targetsPath = path.join(process.cwd(), 'src', 'data', 'names', 'indexed_sitemap_targets.json');
        if (fs.existsSync(targetsPath)) {
            const fileContent = fs.readFileSync(targetsPath, 'utf-8');
            return JSON.parse(fileContent);
        }
    } catch (e) {
        console.error(e);
    }
    return [];
}
