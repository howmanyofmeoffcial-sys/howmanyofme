import fs from 'fs';
import path from 'path';

export function getNamesForLetterServer(letter: string, baseNames: string[]): {name: string, score: number}[] {
  const letterLower = letter.toLowerCase();
  
  const mappedBase = baseNames.map(name => ({ name, score: 100 }));
  
  if (['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'].includes(letterLower)) {
    try {
      const filePath = path.join(process.cwd(), 'src', 'data', 'names', `core_dataset_${letterLower}.json`);
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const coreNames = JSON.parse(fileContent);
        // Map core names to {name, score}
        const mappedCore = coreNames.map((n: any) => ({ name: n.name, score: n.score || 0 }));
        return [...mappedBase, ...mappedCore];
      }
    } catch (e) {
      console.error(e);
    }
  }
  
  return mappedBase;
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
  if (['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'].includes(letter)) {
    try {
      const filePath = path.join(process.cwd(), 'src', 'data', 'names', `core_dataset_${letter}.json`);
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const coreNames = JSON.parse(fileContent);
        const match = coreNames.find((n: any) => n.name.toLowerCase() === nl);
        if (match) {
            // Apply strict SEO rules: score >= 80 -> index, score 60-79 -> noindex, score < 60 -> reject
            let status = "reject";
            if (match.score >= 80) status = "index";
            else if (match.score >= 60) status = "noindex";
            return { status: status, score: match.score, tier: null };
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

export function getAdvancedSimilarNames(name: string, limit: number = 5): string[] {
    const letterLower = name.charAt(0).toLowerCase();
    let similar: string[] = [];
    
    if (['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'].includes(letterLower)) {
        try {
            const filePath = path.join(process.cwd(), 'src', 'data', 'names', `core_dataset_${letterLower}.json`);
            if (fs.existsSync(filePath)) {
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                const coreNames = JSON.parse(fileContent);
                
                // Filter by same starting 2 letters
                const prefix = name.substring(0, 2).toLowerCase();
                const candidates = coreNames.filter((n: any) => 
                  n.name.toLowerCase().startsWith(prefix) && 
                  n.name.toLowerCase() !== name.toLowerCase() &&
                  n.score >= 60 // Only recommend valid names
                );
                
                // Sort by highest score first
                candidates.sort((a: any, b: any) => (b.score || 0) - (a.score || 0));
                similar = candidates.slice(0, limit).map((n: any) => n.name);
            }
        } catch (e) {
            console.error(e);
        }
    }
    
    return similar;
}

export function getAllIndexableNames(): { name: string, score: number }[] {
    const indexable: { name: string, score: number }[] = [];
    ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'].forEach(letter => {
        try {
            const filePath = path.join(process.cwd(), 'src', 'data', 'names', `core_dataset_${letter}.json`);
            if (fs.existsSync(filePath)) {
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                const coreNames = JSON.parse(fileContent);
                coreNames.forEach((n: any) => {
                    if (n.score >= 80) {
                        indexable.push({ name: n.name, score: n.score });
                    }
                });
            }
        } catch (e) {
            console.error(e);
        }
    });
    
    // Sort by score descending
    indexable.sort((a, b) => b.score - a.score);
    return indexable;
}
