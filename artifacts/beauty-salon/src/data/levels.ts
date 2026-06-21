import { CUSTOMERS, Customer, ChallengeType } from "./customers";

export type ServiceType = 'foundation' | 'eyes' | 'lips' | 'hair' | 'nails' | 'outfit' | 'accessories';

export type Difficulty = 'Starter' | 'Easy' | 'Medium' | 'Hard' | 'Expert' | 'Legendary';

export type LevelModifier =
  | 'VIP_BONUS'
  | 'SPEED_CHALLENGE'
  | 'PERFECTIONIST'
  | 'TIPPING_HIGH'
  | 'PICKY'
  | 'SPECIAL_EVENT';

export type GeneratedLevel = {
  id: number;
  customer: Customer;
  services: ServiceType[];
  difficulty: Difficulty;
  starThresholds: { one: number; two: number; three: number };
  modifiers: LevelModifier[];
  coinReward: number;
  gemReward: number;
  xpReward: number;
  challengeType: ChallengeType;
  worldName: string;
  worldEmoji: string;
};

function seededRandom(seed: number, salt: number = 0): number {
  const x = Math.sin(seed * 9301 + salt * 49297 + 233) * 10000;
  return x - Math.floor(x);
}

function seededChoice<T>(arr: T[], seed: number, salt: number = 0): T {
  const idx = Math.floor(seededRandom(seed, salt) * arr.length);
  return arr[Math.max(0, Math.min(idx, arr.length - 1))];
}

const WORLDS = [
  { name: "Starter Studio",  emoji: "🌸", minLevel: 1,    maxLevel: 50    },
  { name: "Glam Boutique",   emoji: "💄", minLevel: 51,   maxLevel: 150   },
  { name: "Chic Salon",      emoji: "✂️", minLevel: 151,  maxLevel: 300   },
  { name: "Beauty Empire",   emoji: "👑", minLevel: 301,  maxLevel: 500   },
  { name: "VIP Lounge",      emoji: "💎", minLevel: 501,  maxLevel: 800   },
  { name: "Grand Spa",       emoji: "🏛️", minLevel: 801,  maxLevel: 1200  },
  { name: "Celeb Hideaway",  emoji: "⭐", minLevel: 1201, maxLevel: 2000  },
  { name: "Fashion Palace",  emoji: "🗼", minLevel: 2001, maxLevel: 3500  },
  { name: "Glam Olympus",    emoji: "🌟", minLevel: 3501, maxLevel: 6000  },
  { name: "Divine Atelier",  emoji: "✨", minLevel: 6001, maxLevel: 10000 },
];

export function getWorld(level: number) {
  return WORLDS.find(w => level >= w.minLevel && level <= w.maxLevel) ?? WORLDS[WORLDS.length - 1];
}

export function getDifficulty(level: number): Difficulty {
  if (level <= 10) return "Starter";
  if (level <= 50) return "Easy";
  if (level <= 200) return "Medium";
  if (level <= 500) return "Hard";
  if (level <= 1500) return "Expert";
  return "Legendary";
}

const ALL_SERVICES: ServiceType[] = ['foundation', 'eyes', 'lips', 'hair', 'nails'];
const FASHION_SERVICES: ServiceType[] = ['foundation', 'eyes', 'lips', 'hair', 'nails', 'outfit'];
const BRIDAL_SERVICES: ServiceType[] = ['foundation', 'eyes', 'lips', 'hair', 'nails', 'accessories'];

export function generateLevel(levelNumber: number): GeneratedLevel {
  const rng = (salt: number) => seededRandom(levelNumber, salt);

  const difficulty = getDifficulty(levelNumber);
  const world = getWorld(levelNumber);

  const challengePool: ChallengeType[] =
    levelNumber <= 10  ? ['classic', 'classic', 'classic'] :
    levelNumber <= 50  ? ['classic', 'classic', 'bridal', 'fashion'] :
    levelNumber <= 200 ? ['classic', 'bridal', 'fashion', 'celebrity'] :
                         ['classic', 'bridal', 'fashion', 'celebrity', 'speed'];
  const challengeType = seededChoice(challengePool, levelNumber, 1);

  const eligibleCustomers =
    challengeType === 'celebrity' ? CUSTOMERS.filter(c => c.isVIP || c.challengeType === 'celebrity') :
    challengeType === 'bridal'    ? CUSTOMERS.filter(c => ['sophie','rose','lily','mia','isabelle'].includes(c.id)) :
    challengeType === 'fashion'   ? CUSTOMERS.filter(c => ['fashion','classic'].includes(c.challengeType)) :
    CUSTOMERS;
  const pool = eligibleCustomers.length > 0 ? eligibleCustomers : CUSTOMERS;
  const customer = seededChoice(pool, levelNumber, 2);

  const serviceCount = Math.min(3 + Math.floor(levelNumber / 10), 6);
  const services: ServiceType[] =
    challengeType === 'fashion'   ? FASHION_SERVICES.slice(0, serviceCount) :
    challengeType === 'bridal'    ? BRIDAL_SERVICES.slice(0, serviceCount) :
    ALL_SERVICES.slice(0, serviceCount);

  const mods: LevelModifier[] = [];
  if (levelNumber > 10  && rng(10) > 0.7) mods.push('TIPPING_HIGH');
  if (levelNumber > 30  && rng(11) > 0.6) mods.push('PICKY');
  if (levelNumber > 100 && rng(12) > 0.8) mods.push('SPEED_CHALLENGE');
  if (levelNumber > 200 && rng(13) > 0.8) mods.push('VIP_BONUS');
  if (levelNumber > 500 && rng(14) > 0.85) mods.push('PERFECTIONIST');
  if (levelNumber % 25 === 0) mods.push('SPECIAL_EVENT');

  const diffMultiplier: Record<Difficulty, number> = { Starter: 1, Easy: 1.5, Medium: 2.5, Hard: 4, Expert: 7, Legendary: 12 };
  const mult = diffMultiplier[difficulty];
  const coinReward = Math.min(Math.floor((20 + levelNumber * 2) * mult * customer.tipMultiplier), 99999);
  const xpReward = Math.floor((10 + levelNumber) * mult);
  const gemReward = levelNumber % 50 === 0 ? 3 : levelNumber % 10 === 0 ? 1 : mods.includes('VIP_BONUS') ? 2 : 0;

  return {
    id: levelNumber,
    customer,
    services,
    difficulty,
    starThresholds: { one: 40, two: 65, three: 85 },
    modifiers: mods,
    coinReward,
    gemReward,
    xpReward,
    challengeType,
    worldName: world.name,
    worldEmoji: world.emoji,
  };
}

export function getWorldProgress(levelNumber: number) {
  const world = getWorld(levelNumber);
  const progress = ((levelNumber - world.minLevel) / (world.maxLevel - world.minLevel)) * 100;
  return { world, progress: Math.min(100, Math.max(0, progress)) };
}
