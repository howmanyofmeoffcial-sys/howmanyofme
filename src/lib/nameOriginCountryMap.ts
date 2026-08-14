export const COUNTRY_FLAGS: Record<string, string> = {
  "India": "🇮🇳",
  "United States": "🇺🇸",
  "United Kingdom": "🇬🇧",
  "Philippines": "🇵🇭",
  "Germany": "🇩🇪",
  "France": "🇫🇷",
  "Canada": "🇨🇦",
  "Australia": "🇦🇺",
  "Japan": "🇯🇵",
  "Brazil": "🇧🇷",
  "Mexico": "🇲🇽",
  "Spain": "🇪🇸",
  "Italy": "🇮🇹",
  "Ireland": "🇮🇪",
  "Nigeria": "🇳🇬",
  "Ghana": "🇬🇭",
  "Kenya": "🇰🇪",
  "Ethiopia": "🇪🇹",
  "South Korea": "🇰🇷",
  "China": "🇨🇳",
  "Russia": "🇷🇺",
  "Poland": "🇵🇱",
  "Netherlands": "🇳🇱",
  "Greece": "🇬🇷",
  "Turkey": "🇹🇷",
  "Saudi Arabia": "🇸🇦",
  "Egypt": "🇪🇬",
  "Pakistan": "🇵🇰",
  "Bangladesh": "🇧🇩",
  "Nepal": "🇳🇵",
  "Sri Lanka": "🇱🇰",
  "Myanmar": "🇲🇲",
  "Israel": "🇮🇱",
  "Iran": "🇮🇷",
  "Sweden": "🇸🇪",
  "Norway": "🇳🇴",
  "Denmark": "🇩🇰",
  "Finland": "🇫🇮",
  "Portugal": "🇵🇹",
  "Romania": "🇷🇴",
  "Hungary": "🇭🇺",
  "Czech Republic": "🇨🇿",
  "Ukraine": "🇺🇦",
  "Argentina": "🇦🇷",
  "Colombia": "🇨🇴",
  "Peru": "🇵🇪",
  "Venezuela": "🇻🇪",
  "Chile": "🇨🇱",
  "New Zealand": "🇳🇿",
  "South Africa": "🇿🇦",
  "Tanzania": "🇹🇿",
  "Uganda": "🇺🇬",
  "Morocco": "🇲🇦",
  "Algeria": "🇩🇿",
  "Tunisia": "🇹🇳",
  "Singapore": "🇸🇬",
  "Malaysia": "🇲🇾",
  "Indonesia": "🇮🇩",
  "Thailand": "🇹🇭",
  "Vietnam": "🇻🇳",
  "Taiwan": "🇹🇼",
  "Eritrea": "🇪🇷",
  "Afghanistan": "🇦🇫",
  "Tajikistan": "🇹🇯",
  "Austria": "🇦🇹",
  "Switzerland": "🇨🇭",
  "Belgium": "🇧🇪",
  "Cyprus": "🇨🇾",
  "Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
};

// Detect likely country distribution from name patterns and origin
export function inferCountriesFromName(
  name: string,
  origin: string
): Array<{ country: string; count: number }> {
  const lower = name.toLowerCase();

  let hash = 0;
  for (let i = 0; i < lower.length; i++) {
    hash = ((hash << 5) - hash) + lower.charCodeAt(i);
    hash |= 0;
  }
  const abs = Math.abs(hash);

  // Mizo / Northeast Indian — short, ending vowel + i/ii/ui
  if (/[aeiou](i{1,2}|ui)$/.test(lower) && lower.length <= 9) {
    return [
      { country: "India", count: (abs % 35) + 5 },
      { country: "Myanmar", count: (abs % 8) + 1 },
    ];
  }

  if (/(berto|naldo|ando|ardo|ric|ito|ario|ino|illo)$/.test(lower)) {
    return [
      { country: "Philippines", count: (abs % 3000) + 500 },
      { country: "Spain", count: (abs % 800) + 100 },
      { country: "United States", count: (abs % 600) + 200 },
      { country: "Mexico", count: (abs % 400) + 50 },
    ];
  }

  if (/(uddin|udin|ullah|rahman|rahim|hussain|hussein|khan|patel)$/.test(lower)) {
    return [
      { country: "Bangladesh", count: (abs % 5000) + 1000 },
      { country: "Pakistan", count: (abs % 4000) + 500 },
      { country: "India", count: (abs % 3000) + 300 },
      { country: "United Kingdom", count: (abs % 800) + 100 },
    ];
  }

  if (/(bjorn|bjørn|vik|sson|ssen|sen|berg|borg|dal|lund|gren|qvist)$/.test(lower)) {
    return [
      { country: "Sweden", count: (abs % 2000) + 200 },
      { country: "Norway", count: (abs % 1500) + 100 },
      { country: "Denmark", count: (abs % 1000) + 100 },
      { country: "Finland", count: (abs % 500) + 50 },
    ];
  }

  if (/^(o'|mc|mac|o)/.test(lower) && lower.length > 4) {
    return [
      { country: "Ireland", count: (abs % 5000) + 500 },
      { country: "United Kingdom", count: (abs % 4000) + 300 },
      { country: "United States", count: (abs % 3000) + 200 },
      { country: "Australia", count: (abs % 1000) + 100 },
    ];
  }

  if (/(ade|ola|emi|ebi|tunde|wale|sola|bisi|nike|funmi)$/.test(lower)) {
    return [
      { country: "Nigeria", count: (abs % 8000) + 500 },
      { country: "Ghana", count: (abs % 2000) + 100 },
      { country: "United Kingdom", count: (abs % 1000) + 50 },
      { country: "United States", count: (abs % 500) + 50 },
    ];
  }

  if (/(aye|ework|enat|asha|ish|awit|elet)$/.test(lower)) {
    return [
      { country: "Ethiopia", count: (abs % 5000) + 200 },
      { country: "Eritrea", count: (abs % 1000) + 50 },
    ];
  }

  if (/(anga|ungu|ambi|imbi|ondo|eko)$/.test(lower) && lower.length > 5) {
    return [
      { country: "Kenya", count: (abs % 4000) + 200 },
      { country: "Tanzania", count: (abs % 3000) + 150 },
      { country: "Uganda", count: (abs % 2000) + 100 },
    ];
  }

  if (origin === "Japanese" || /(ko|mi|ri|ka|na|ro|to|shi|hiro|yuki|hana)$/.test(lower)) {
    return [
      { country: "Japan", count: (abs % 20000) + 1000 },
      { country: "United States", count: (abs % 2000) + 100 },
      { country: "Brazil", count: (abs % 500) + 50 },
    ];
  }

  if (origin === "Korean") {
    return [
      { country: "South Korea", count: (abs % 50000) + 5000 },
      { country: "United States", count: (abs % 3000) + 200 },
      { country: "China", count: (abs % 2000) + 100 },
    ];
  }

  const originMap: Record<string, Array<{ country: string; weight: number }>> = {
    Sanskrit: [
      { country: "India", weight: 60 },
      { country: "Nepal", weight: 20 },
      { country: "Sri Lanka", weight: 10 },
      { country: "Bangladesh", weight: 5 },
    ],
    Hindi: [
      { country: "India", weight: 70 },
      { country: "Nepal", weight: 15 },
      { country: "United States", weight: 8 },
    ],
    Celtic: [
      { country: "Ireland", weight: 35 },
      { country: "United Kingdom", weight: 35 },
      { country: "United States", weight: 20 },
      { country: "Australia", weight: 7 },
    ],
    Gaelic: [
      { country: "Ireland", weight: 45 },
      { country: "Scotland", weight: 30 },
      { country: "United States", weight: 15 },
    ],
    Welsh: [
      { country: "United Kingdom", weight: 60 },
      { country: "United States", weight: 25 },
      { country: "Australia", weight: 10 },
    ],
    Hebrew: [
      { country: "Israel", weight: 30 },
      { country: "United States", weight: 40 },
      { country: "United Kingdom", weight: 12 },
      { country: "Canada", weight: 8 },
    ],
    Arabic: [
      { country: "Saudi Arabia", weight: 18 },
      { country: "Egypt", weight: 18 },
      { country: "Morocco", weight: 10 },
      { country: "Algeria", weight: 8 },
      { country: "Nigeria", weight: 8 },
      { country: "United States", weight: 8 },
    ],
    Germanic: [
      { country: "Germany", weight: 40 },
      { country: "United States", weight: 28 },
      { country: "Austria", weight: 10 },
      { country: "Switzerland", weight: 8 },
    ],
    Scandinavian: [
      { country: "Sweden", weight: 35 },
      { country: "Norway", weight: 28 },
      { country: "Denmark", weight: 22 },
      { country: "Finland", weight: 10 },
    ],
    Latin: [
      { country: "Italy", weight: 28 },
      { country: "Spain", weight: 22 },
      { country: "France", weight: 18 },
      { country: "Portugal", weight: 10 },
      { country: "Romania", weight: 8 },
    ],
    Greek: [
      { country: "Greece", weight: 52 },
      { country: "Cyprus", weight: 18 },
      { country: "United States", weight: 15 },
      { country: "Australia", weight: 8 },
    ],
    Slavic: [
      { country: "Russia", weight: 35 },
      { country: "Poland", weight: 22 },
      { country: "Ukraine", weight: 18 },
      { country: "Czech Republic", weight: 8 },
    ],
    Japanese: [
      { country: "Japan", weight: 88 },
      { country: "United States", weight: 7 },
      { country: "Brazil", weight: 3 },
    ],
    Chinese: [
      { country: "China", weight: 70 },
      { country: "Taiwan", weight: 10 },
      { country: "Singapore", weight: 8 },
      { country: "Malaysia", weight: 5 },
    ],
    Korean: [
      { country: "South Korea", weight: 85 },
      { country: "United States", weight: 8 },
      { country: "China", weight: 4 },
    ],
    Turkish: [
      { country: "Turkey", weight: 80 },
      { country: "Germany", weight: 10 },
      { country: "Netherlands", weight: 4 },
    ],
    Persian: [
      { country: "Iran", weight: 72 },
      { country: "Afghanistan", weight: 15 },
      { country: "Tajikistan", weight: 5 },
    ],
    Filipino: [
      { country: "Philippines", weight: 75 },
      { country: "United States", weight: 15 },
      { country: "Saudi Arabia", weight: 4 },
    ],
    Irish: [
      { country: "Ireland", weight: 45 },
      { country: "United States", weight: 30 },
      { country: "United Kingdom", weight: 15 },
      { country: "Australia", weight: 7 },
    ],
    French: [
      { country: "France", weight: 50 },
      { country: "Belgium", weight: 10 },
      { country: "Canada", weight: 12 },
      { country: "Switzerland", weight: 8 },
    ],
    Spanish: [
      { country: "Mexico", weight: 28 },
      { country: "Spain", weight: 20 },
      { country: "Colombia", weight: 12 },
      { country: "Argentina", weight: 10 },
      { country: "United States", weight: 12 },
    ],
    English: [
      { country: "United States", weight: 45 },
      { country: "United Kingdom", weight: 20 },
      { country: "Canada", weight: 12 },
      { country: "Australia", weight: 10 },
      { country: "New Zealand", weight: 4 },
    ],
  };

  const mapping = originMap[origin] ?? originMap["English"];
  const baseCount = (abs % 50000) + 500;

  return mapping.map(({ country, weight }) => ({
    country,
    count: Math.floor((baseCount * weight) / 100),
  }));
}
