import fs from 'fs';
import path from 'path';
import { A_NAMES } from './names/namesA';
import { B_NAMES } from './names/namesB';

// Re-use EXTENDED_NAMES logic or just access what we need
export function getNamesForLetterServer(letter: string, baseNames: string[]): string[] {
  const letterLower = letter.toLowerCase();
  
  if (letterLower === 'a' || letterLower === 'b') {
    try {
      const filePath = path.join(process.cwd(), 'src', 'data', 'names', `extended_${letterLower}.json`);
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const extendedNames = JSON.parse(fileContent);
        return [...baseNames, ...extendedNames.map((n: any) => n.name)];
      }
    } catch (e) {
      console.error(e);
    }
  }
  
  return baseNames;
}

export function getRegistryStatus(name: string): { status: string, score: number } | null {
  const nl = name.toLowerCase();
  const letter = nl.charAt(0);
  
  if (letter === 'a') {
    const match = A_NAMES.find(n => n.name.toLowerCase() === nl);
    if (match) return { status: match.status, score: match.score };
  } else if (letter === 'b') {
    const match = B_NAMES.find(n => n.name.toLowerCase() === nl);
    if (match) return { status: match.status, score: match.score };
  }
  
  if (letter === 'a' || letter === 'b') {
    try {
      const filePath = path.join(process.cwd(), 'src', 'data', 'names', `extended_${letter}.json`);
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const extendedNames = JSON.parse(fileContent);
        const match = extendedNames.find((n: any) => n.name.toLowerCase() === nl);
        if (match) return { status: match.status, score: match.score };
      }
    } catch (e) {
      console.error(e);
    }
    
    return { status: "reject", score: 0 };
  }
  
  return null;
}
