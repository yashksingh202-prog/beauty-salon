export type UpgradeId = 'chair' | 'mirror' | 'products' | 'reception' | 'lighting';

export type UpgradeLevel = {
  level: number;
  name: string;
  cost: number;
  effect: string;
  bonus: number;
};

export type SalonUpgrade = {
  id: UpgradeId;
  name: string;
  emoji: string;
  description: string;
  maxLevel: number;
  levels: UpgradeLevel[];
  statLabel: string;
};

export const SALON_UPGRADES: SalonUpgrade[] = [
  {
    id: 'chair',
    name: 'Styling Chair',
    emoji: '💺',
    description: 'Better chairs mean more comfortable customers. VIP customers pay more when relaxed.',
    maxLevel: 5,
    statLabel: 'Customer Comfort',
    levels: [
      { level: 1, name: 'Basic Chair',    cost: 0,    effect: 'Standard service',         bonus: 0   },
      { level: 2, name: 'Padded Chair',   cost: 300,  effect: '+10% tip from customers',  bonus: 10  },
      { level: 3, name: 'Leather Chair',  cost: 800,  effect: '+20% tip from customers',  bonus: 20  },
      { level: 4, name: 'Massage Chair',  cost: 2000, effect: '+35% tip from customers',  bonus: 35  },
      { level: 5, name: 'Royal Throne',   cost: 5000, effect: '+50% tip from customers',  bonus: 50  },
    ],
  },
  {
    id: 'mirror',
    name: 'Vanity Mirror',
    emoji: '🪞',
    description: 'High-quality mirrors help you work with more precision, boosting your quality scores.',
    maxLevel: 5,
    statLabel: 'Precision Bonus',
    levels: [
      { level: 1, name: 'Basic Mirror',     cost: 0,    effect: 'Standard quality',           bonus: 0  },
      { level: 2, name: 'LED Mirror',       cost: 400,  effect: '+10% quality score bonus',   bonus: 10 },
      { level: 3, name: 'Hollywood Mirror', cost: 1000, effect: '+20% quality score bonus',   bonus: 20 },
      { level: 4, name: 'Smart Mirror',     cost: 2500, effect: '+35% quality score bonus',   bonus: 35 },
      { level: 5, name: 'Diamond Mirror',   cost: 6000, effect: '+50% quality score bonus',   bonus: 50 },
    ],
  },
  {
    id: 'products',
    name: 'Product Range',
    emoji: '🧴',
    description: 'Premium products unlock more style options and increase customer satisfaction.',
    maxLevel: 5,
    statLabel: 'Style Options',
    levels: [
      { level: 1, name: 'Starter Kit',      cost: 0,    effect: 'Basic product range',        bonus: 0  },
      { level: 2, name: 'Pro Kit',           cost: 500,  effect: '+2 extra style choices',     bonus: 2  },
      { level: 3, name: 'Luxury Kit',        cost: 1200, effect: '+4 extra style choices',     bonus: 4  },
      { level: 4, name: 'Celebrity Kit',     cost: 3000, effect: '+6 extra style choices',     bonus: 6  },
      { level: 5, name: 'Couture Kit',       cost: 7500, effect: '+8 extra style choices',     bonus: 8  },
    ],
  },
  {
    id: 'reception',
    name: 'Reception Desk',
    emoji: '🌺',
    description: 'A welcoming reception attracts more high-value customers and increases coin earnings.',
    maxLevel: 5,
    statLabel: 'Coin Earnings',
    levels: [
      { level: 1, name: 'Basic Desk',        cost: 0,    effect: 'Standard earnings',          bonus: 0  },
      { level: 2, name: 'Flower Desk',       cost: 350,  effect: '+15% coin earnings',         bonus: 15 },
      { level: 3, name: 'Luxury Desk',       cost: 900,  effect: '+30% coin earnings',         bonus: 30 },
      { level: 4, name: 'VIP Reception',     cost: 2200, effect: '+50% coin earnings',         bonus: 50 },
      { level: 5, name: 'Grand Foyer',       cost: 5500, effect: '+75% coin earnings',         bonus: 75 },
    ],
  },
  {
    id: 'lighting',
    name: 'Studio Lighting',
    emoji: '💡',
    description: 'Perfect lighting increases gem drop rates and makes every makeover more stunning.',
    maxLevel: 5,
    statLabel: 'Gem Drop Rate',
    levels: [
      { level: 1, name: 'Warm Bulbs',        cost: 0,    effect: 'Standard gem drops',         bonus: 0  },
      { level: 2, name: 'Ring Light',        cost: 600,  effect: '+25% gem drop chance',       bonus: 25 },
      { level: 3, name: 'Studio Lights',     cost: 1500, effect: '+50% gem drop chance',       bonus: 50 },
      { level: 4, name: 'Neon Lights',       cost: 3500, effect: '+75% gem drop chance',       bonus: 75 },
      { level: 5, name: 'Holographic Lab',   cost: 8000, effect: 'Guaranteed gem every level', bonus: 100 },
    ],
  },
];

export type SalonUpgradesState = Record<UpgradeId, number>; // maps upgradeId → current level (1-5)

export const DEFAULT_SALON_UPGRADES: SalonUpgradesState = {
  chair: 1,
  mirror: 1,
  products: 1,
  reception: 1,
  lighting: 1,
};

export function getUpgradeBonus(upgrades: SalonUpgradesState, id: UpgradeId): number {
  const upgrade = SALON_UPGRADES.find(u => u.id === id)!;
  const level = upgrades[id] ?? 1;
  return upgrade.levels[level - 1]?.bonus ?? 0;
}

export function getUpgradeCost(id: UpgradeId, targetLevel: number): number {
  const upgrade = SALON_UPGRADES.find(u => u.id === id)!;
  return upgrade.levels[targetLevel - 1]?.cost ?? Infinity;
}
