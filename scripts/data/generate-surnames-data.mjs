import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");

const RAW_TOP_100_SURNAMES = [
  { name: "Smith", rank: 1, count: 2442977, prop100k: 828.16, origin: "English / Anglo-Saxon (Occupational: Metalsmith)" },
  { name: "Johnson", rank: 2, count: 1932812, prop100k: 655.24, origin: "English / Scandinavian (Patronymic: Son of John)" },
  { name: "Williams", rank: 3, count: 1625252, prop100k: 550.97, origin: "Welsh / English (Patronymic: Son of William)" },
  { name: "Brown", rank: 4, count: 1437026, prop100k: 487.16, origin: "English / Scottish (Descriptive: Brown hair or complexion)" },
  { name: "Jones", rank: 5, count: 1425470, prop100k: 483.24, origin: "Welsh / English (Patronymic: Son of John/Johan)" },
  { name: "Garcia", rank: 6, count: 1166120, prop100k: 395.32, origin: "Spanish / Basque (Patronymic / Topographic: Bear or Young)" },
  { name: "Miller", rank: 7, count: 1161437, prop100k: 393.73, origin: "English / German (Occupational: One who operates a mill)" },
  { name: "Davis", rank: 8, count: 1116357, prop100k: 378.45, origin: "Welsh / English (Patronymic: Son of David)" },
  { name: "Rodriguez", rank: 9, count: 1094924, prop100k: 371.19, origin: "Spanish (Patronymic: Son of Rodrigo)" },
  { name: "Martinez", rank: 10, count: 1060159, prop100k: 359.41, origin: "Spanish (Patronymic: Son of Martin)" },
  { name: "Hernandez", rank: 11, count: 1043281, prop100k: 353.68, origin: "Spanish (Patronymic: Son of Hernando/Fernando)" },
  { name: "Lopez", rank: 12, count: 874523, prop100k: 296.47, origin: "Spanish (Patronymic: Son of Lope - Wolf)" },
  { name: "Gonzalez", rank: 13, count: 841025, prop100k: 285.11, origin: "Spanish (Patronymic: Son of Gonzalo)" },
  { name: "Wilson", rank: 14, count: 801882, prop100k: 271.84, origin: "English / Scottish (Patronymic: Son of Will)" },
  { name: "Anderson", rank: 15, count: 784404, prop100k: 265.92, origin: "Scandinavian / Scottish (Patronymic: Son of Andrew)" },
  { name: "Thomas", rank: 16, count: 756142, prop100k: 256.34, origin: "Welsh / English (Patronymic: From the Aramaic 'Twin')" },
  { name: "Taylor", rank: 17, count: 751209, prop100k: 254.66, origin: "English / French (Occupational: Tailor / Cutter of cloth)" },
  { name: "Moore", rank: 18, count: 724374, prop100k: 245.57, origin: "English / Irish (Topographic: Living near a moor)" },
  { name: "Jackson", rank: 19, count: 708099, prop100k: 240.05, origin: "English / Scottish (Patronymic: Son of Jack)" },
  { name: "Martin", rank: 20, count: 702625, prop100k: 238.19, origin: "French / English (From the Roman god Mars / Warlike)" },
  { name: "Lee", rank: 21, count: 693023, prop100k: 234.94, origin: "English / Asian (Topographic: Clearing or Meadow / Chinese Plum)" },
  { name: "Perez", rank: 22, count: 681645, prop100k: 231.08, origin: "Spanish (Patronymic: Son of Pedro / Rock)" },
  { name: "Thompson", rank: 23, count: 664644, prop100k: 225.32, origin: "English / Scottish (Patronymic: Son of Tom)" },
  { name: "White", rank: 24, count: 660491, prop100k: 223.91, origin: "English / Scottish (Descriptive: Fair hair or pale skin)" },
  { name: "Harris", rank: 25, count: 624252, prop100k: 211.63, origin: "English / Welsh (Patronymic: Son of Harry)" },
  { name: "Sanchez", rank: 26, count: 612752, prop100k: 207.73, origin: "Spanish (Patronymic: Son of Sancho / Sanctified)" },
  { name: "Clark", rank: 27, count: 562679, prop100k: 190.75, origin: "English / Scottish (Occupational: Scribe, cleric or clerk)" },
  { name: "Ramirez", rank: 28, count: 557423, prop100k: 188.97, origin: "Spanish (Patronymic: Son of Ramiro / Great Judge)" },
  { name: "Lewis", rank: 29, count: 531781, prop100k: 180.28, origin: "Welsh / English (Norman French Louis / Renowned warrior)" },
  { name: "Robinson", rank: 30, count: 529821, prop100k: 179.61, origin: "English / Scottish (Patronymic: Son of Robin)" },
  { name: "Walker", rank: 31, count: 523129, prop100k: 177.34, origin: "English / Scottish (Occupational: Fuller of cloth)" },
  { name: "Young", rank: 32, count: 484447, prop100k: 164.23, origin: "English / Scottish (Descriptive: The younger of two people)" },
  { name: "Allen", rank: 33, count: 482607, prop100k: 163.61, origin: "Celtic / Scottish (Handsome or Little Rock)" },
  { name: "King", rank: 34, count: 465422, prop100k: 157.78, origin: "English / Scottish (Status name or actor playing a king)" },
  { name: "Wright", rank: 35, count: 458980, prop100k: 155.60, origin: "English (Occupational: Craftsman or Woodworker)" },
  { name: "Scott", rank: 36, count: 439530, prop100k: 149.00, origin: "English / Scottish (Ethnic name: Person from Scotland)" },
  { name: "Torres", rank: 37, count: 437813, prop100k: 148.42, origin: "Spanish / Portuguese (Topographic: Living near towers)" },
  { name: "Nguyen", rank: 38, count: 437645, prop100k: 148.36, origin: "Vietnamese (Royal dynasty / Musical instrument)" },
  { name: "Hill", rank: 39, count: 434427, prop100k: 147.27, origin: "English (Topographic: Person who lived near a hill)" },
  { name: "Flores", rank: 40, count: 433969, prop100k: 147.12, origin: "Spanish (Patronymic: Son of Floro / Blooming)" },
  { name: "Green", rank: 41, count: 430182, prop100k: 145.83, origin: "English (Topographic: Living near the village green)" },
  { name: "Adams", rank: 42, count: 427843, prop100k: 145.04, origin: "English / Hebrew (Patronymic: Son of Adam / Earth)" },
  { name: "Nelson", rank: 43, count: 424958, prop100k: 144.06, origin: "Scandinavian / English (Patronymic: Son of Nell/Neil)" },
  { name: "Baker", rank: 44, count: 419586, prop100k: 142.24, origin: "English (Occupational: Baker of bread)" },
  { name: "Hall", rank: 45, count: 416551, prop100k: 141.21, origin: "English / Scottish (Topographic / Occupational: Manor hall)" },
  { name: "Rivera", rank: 46, count: 391114, prop100k: 132.59, origin: "Spanish (Topographic: Person living by a riverbank)" },
  { name: "Campbell", rank: 47, count: 386157, prop100k: 130.91, origin: "Scottish / Gaelic (Descriptive: Crooked mouth / Wry mouth)" },
  { name: "Mitchell", rank: 48, count: 384486, prop100k: 130.34, origin: "English / Scottish (Medieval form of Michael)" },
  { name: "Carter", rank: 49, count: 376986, prop100k: 127.80, origin: "English / Irish (Occupational: One who transports goods by cart)" },
  { name: "Roberts", rank: 50, count: 376377, prop100k: 127.59, origin: "Welsh / English (Patronymic: Son of Robert)" },
];

const processedSurnames = RAW_TOP_100_SURNAMES.map((s) => ({
  name: s.name,
  slug: s.name.toLowerCase(),
  rank: s.rank,
  count: s.count,
  prop100k: s.prop100k,
  origin: s.origin,
  censusYear: "2010/2020",
  source: "U.S. Census Bureau Frequently Occurring Surnames",
  sampleFirstNames: ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda"],
}));

const destFile = path.join(root, "src/data/generated/canonical-surnames.json");
fs.writeFileSync(destFile, JSON.stringify(processedSurnames, null, 2), "utf8");
console.log(`[surnames-pipeline] Generated ${processedSurnames.length} canonical surnames in ${destFile}`);
