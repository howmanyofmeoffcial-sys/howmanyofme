import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { EXTENDED_NAMES } from '@/data/nameData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  if (!query || query.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  const q = query.toLowerCase();
  const letter = q.charAt(0);
  
  let candidates: string[] = [];

  // If query starts with A or B, grab from core dataset
  if (letter === 'a' || letter === 'b') {
    try {
      const filePath = path.join(process.cwd(), 'src', 'data', 'names', `core_dataset_${letter}.json`);
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const coreNames = JSON.parse(fileContent);
        candidates = coreNames.map((n: any) => n.name);
      }
    } catch (e) {
      console.error(e);
    }
  } else {
    // For other letters, use the common prefixes
    candidates = EXTENDED_NAMES[letter] || [];
  }
  
  // Also include popular names matching the query
  const allCommon = Object.values(EXTENDED_NAMES).flat();
  candidates = Array.from(new Set([...candidates, ...allCommon]));

  const suggestions = candidates
    .filter(n => n.toLowerCase().includes(q))
    .slice(0, 20);

  return NextResponse.json({ suggestions });
}
