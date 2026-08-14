import { getNameRecord } from "../names/getNameRecord";

export interface PersonalizedBirthYearInsight {
  birthYear: number;
  generation: string;
  generationDescription: string;
  chineseZodiac: string;
  chineseZodiacEmoji: string;
  westernZodiac?: {
    sign: string;
    symbol: string;
  };
  historicalEraContext: string;
  namePopularityInYear?: {
    birthCountEstimate?: number;
    eraRankDescription?: string;
  };
}

const CHINESE_ZODIAC_ANIMALS = [
  { animal: "Rat", emoji: "🐀" },
  { animal: "Ox", emoji: "🐂" },
  { animal: "Tiger", emoji: "🐅" },
  { animal: "Rabbit", emoji: "🐇" },
  { animal: "Dragon", emoji: "🐉" },
  { animal: "Snake", emoji: "🐍" },
  { animal: "Horse", emoji: "🐎" },
  { animal: "Goat", emoji: "🐐" },
  { animal: "Monkey", emoji: "🐒" },
  { animal: "Rooster", emoji: "🐓" },
  { animal: "Dog", emoji: "🐕" },
  { animal: "Pig", emoji: "🐖" },
];

/**
 * 1. Generation Classification
 */
export function getGeneration(year: number): { name: string; description: string } {
  if (year >= 2013) {
    return {
      name: "Gen Alpha",
      description: "Digital-native generation born 2013 and later.",
    };
  }
  if (year >= 1997) {
    return {
      name: "Gen Z",
      description: "Internet and social-connectivity generation born 1997–2012.",
    };
  }
  if (year >= 1981) {
    return {
      name: "Millennial",
      description: "Tech-bridge generation born 1981–1996.",
    };
  }
  if (year >= 1965) {
    return {
      name: "Gen X",
      description: "Independent generation born 1965–1980.",
    };
  }
  if (year >= 1946) {
    return {
      name: "Baby Boomer",
      description: "Post-war demographic cohort born 1946–1964.",
    };
  }
  if (year >= 1928) {
    return {
      name: "Silent Generation",
      description: "Resilient mid-century cohort born 1928–1945.",
    };
  }
  return {
    name: "Greatest Generation",
    description: "Historical cohort born prior to 1928.",
  };
}

/**
 * 2. Chinese Zodiac Mapping
 */
export function getChineseZodiac(year: number): { animal: string; emoji: string } {
  // Base year 1900 was Year of the Rat (index 0)
  // (1900 - 4) % 12 = 0
  const normalizedIndex = (year - 4) % 12;
  const index = normalizedIndex < 0 ? (normalizedIndex + 12) % 12 : normalizedIndex;
  const match = CHINESE_ZODIAC_ANIMALS[index];
  return {
    animal: match.animal,
    emoji: match.emoji,
  };
}

/**
 * 3. Western Zodiac from Month / Day
 */
export function getWesternZodiac(month: number, day: number): { sign: string; symbol: string } | undefined {
  if (!month || !day || month < 1 || month > 12 || day < 1 || day > 31) {
    return undefined;
  }

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return { sign: "Aries", symbol: "♈" };
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return { sign: "Taurus", symbol: "♉" };
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return { sign: "Gemini", symbol: "♊" };
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return { sign: "Cancer", symbol: "♋" };
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return { sign: "Leo", symbol: "♌" };
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return { sign: "Virgo", symbol: "♍" };
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return { sign: "Libra", symbol: "♎" };
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return { sign: "Scorpio", symbol: "♏" };
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return { sign: "Sagittarius", symbol: "♐" };
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return { sign: "Capricorn", symbol: "♑" };
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return { sign: "Aquarius", symbol: "♒" };
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return { sign: "Pisces", symbol: "♓" };

  return undefined;
}

/**
 * 4. Master Personalization Engine
 */
export function calculatePersonalizedInsights(
  name: string,
  birthYear: number,
  month?: number,
  day?: number
): PersonalizedBirthYearInsight | null {
  const currentYear = new Date().getFullYear();
  if (isNaN(birthYear) || birthYear < 1900 || birthYear > currentYear) {
    return null;
  }

  const gen = getGeneration(birthYear);
  const zodiac = getChineseZodiac(birthYear);
  const western = month && day ? getWesternZodiac(month, day) : undefined;

  // Retrieve historical name data for this decade if available
  const decade = `${Math.floor(birthYear / 10) * 10}s`;
  const record = getNameRecord(name);

  let historicalEraContext = `In ${birthYear}, this cohort marked the ${decade} era of American naming trends.`;
  let namePopularityInYear: PersonalizedBirthYearInsight["namePopularityInYear"] = undefined;

  if (record && record.decade_popularity && record.decade_popularity[decade]) {
    const decadeCount = record.decade_popularity[decade];
    namePopularityInYear = {
      birthCountEstimate: Math.round(decadeCount / 10),
      eraRankDescription: `Recorded ~${(decadeCount / 10).toLocaleString()} annual births in the ${decade}.`,
    };
    historicalEraContext = `During the ${decade}, when you were born, ${name} recorded approximately ${decadeCount.toLocaleString()} total birth registrations nationwide.`;
  }

  return {
    birthYear,
    generation: gen.name,
    generationDescription: gen.description,
    chineseZodiac: zodiac.animal,
    chineseZodiacEmoji: zodiac.emoji,
    westernZodiac: western,
    historicalEraContext,
    namePopularityInYear,
  };
}
