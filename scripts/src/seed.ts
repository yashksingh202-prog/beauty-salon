import { db } from "@workspace/db";
import {
  storiesTable,
  bossesTable,
  gameEventsTable,
  premiumPlansTable,
  spinPrizesTable,
  adConfigsTable,
} from "@workspace/db";

async function main() {
  console.log("Seeding database...");

  // Seed premium plans
  await db.delete(premiumPlansTable);
  await db.insert(premiumPlansTable).values([
    {
      name: "Adventurer",
      price: "4.99",
      currency: "USD",
      durationDays: 30,
      gemsBonus: 50,
      coinsBonus: 500,
      features: ["Unlimited stories", "2x coin rewards", "Exclusive boss battles", "Priority support"],
    },
    {
      name: "Champion",
      price: "9.99",
      currency: "USD",
      durationDays: 30,
      gemsBonus: 150,
      coinsBonus: 1500,
      features: ["Unlimited stories", "3x coin rewards", "All boss battles", "Ad-free", "Early access", "Priority support"],
    },
    {
      name: "Legend",
      price: "19.99",
      currency: "USD",
      durationDays: 30,
      gemsBonus: 400,
      coinsBonus: 5000,
      features: ["Everything in Champion", "5x coin rewards", "Exclusive legendary stories", "Custom avatar frames", "Discord VIP role", "24/7 support"],
    },
  ]).onConflictDoNothing();

  // Seed spin prizes
  await db.delete(spinPrizesTable);
  await db.insert(spinPrizesTable).values([
    { label: "50 Coins", type: "coins", value: 50, probability: "0.3000", color: "#f59e0b" },
    { label: "100 Coins", type: "coins", value: 100, probability: "0.2500", color: "#f97316" },
    { label: "5 Gems", type: "gems", value: 5, probability: "0.1500", color: "#8b5cf6" },
    { label: "200 Coins", type: "coins", value: 200, probability: "0.1200", color: "#ef4444" },
    { label: "10 Gems", type: "gems", value: 10, probability: "0.0800", color: "#6366f1" },
    { label: "Miss", type: "miss", value: 0, probability: "0.0500", color: "#6b7280" },
    { label: "2x Multiplier", type: "multiplier", value: 2, probability: "0.0300", color: "#10b981" },
    { label: "500 Coins", type: "coins", value: 500, probability: "0.0200", color: "#ec4899" },
  ]);

  // Seed ad configs
  await db.delete(adConfigsTable);
  await db.insert(adConfigsTable).values([
    { name: "Rewarded Video Ad", type: "rewarded", coinsReward: 20, gemsReward: 0, dailyLimit: 5 },
    { name: "Interstitial Ad", type: "interstitial", coinsReward: 5, gemsReward: 0, dailyLimit: 10 },
  ]);

  // Seed bosses
  await db.delete(bossesTable);
  await db.insert(bossesTable).values([
    { name: "Shadow Wraith", description: "A malevolent spirit born from forgotten nightmares, feeding on the fears of the living.", difficulty: "normal", hp: 500, coinsReward: 150, gemsReward: 5, xpReward: 300, cooldownHours: 12 },
    { name: "Iron Golem", description: "An ancient construct of stone and metal, guardian of a crumbled civilization.", difficulty: "hard", hp: 1200, coinsReward: 350, gemsReward: 15, xpReward: 700, cooldownHours: 24 },
    { name: "Void Serpent", description: "A creature from the space between worlds, its scales shimmer with the darkness of the void.", difficulty: "extreme", hp: 2500, coinsReward: 800, gemsReward: 40, xpReward: 1500, cooldownHours: 48 },
    { name: "Eternal Lich King", description: "The most powerful undead sorcerer who has defied death for millennia, ruling over a realm of eternal shadow.", difficulty: "legendary", hp: 5000, coinsReward: 2000, gemsReward: 100, xpReward: 5000, cooldownHours: 72 },
  ]);

  // Seed game events
  await db.delete(gameEventsTable);
  const now = new Date();
  const in7days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const in14days = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  await db.insert(gameEventsTable).values([
    { name: "Moonfall Festival", description: "Celebrate the ancient moonfall with special story chapters and triple rewards for 7 days.", type: "seasonal", status: "active", startAt: yesterday, endAt: in7days, coinsReward: 500, gemsReward: 25 },
    { name: "Dragon's Awakening", description: "The great dragon stirs. Complete dragon-themed stories to earn legendary rewards.", type: "story", status: "active", startAt: now, endAt: in14days, coinsReward: 1000, gemsReward: 50 },
    { name: "Boss Rush Weekend", description: "Face all bosses in sequence for massive bonus rewards.", type: "battle", status: "upcoming", startAt: in7days, endAt: in14days, coinsReward: 2000, gemsReward: 100 },
  ]);

  // Seed 100 story levels (a sample from 1000)
  await db.delete(storiesTable);
  const categories = ["adventure", "mystery", "fantasy", "sci-fi", "horror", "romance", "thriller"];
  const difficulties = ["easy", "medium", "hard", "legendary"] as const;
  const storyTitles = [
    "The Forgotten Temple", "Echoes of the Past", "Shadows of Tomorrow", "The Lost Kingdom",
    "Whispers in the Dark", "Beyond the Veil", "The Ancient Prophecy", "Realm of Shadows",
    "The Crystal Caves", "Last Stand at Dawn", "The Dragon's Lair", "Secrets of the Guild",
    "Into the Abyss", "The Phantom Rider", "Curse of the Moon", "The Iron Throne",
    "Voices from Beyond", "The Hidden Path", "Ruins of Eternity", "The Chosen One",
  ];

  const stories = Array.from({ length: 100 }, (_, i) => {
    const level = i + 1;
    const diffIndex = Math.floor(i / 25);
    const diff = difficulties[Math.min(diffIndex, 3)];
    const titleBase = storyTitles[i % storyTitles.length];
    const category = categories[i % categories.length];
    const multiplier = diffIndex + 1;
    return {
      levelNumber: level,
      title: `${titleBase} ${level > 20 ? `- Part ${Math.ceil(level / 20)}` : ""}`.trim(),
      description: `A ${diff} ${category} adventure awaiting brave souls. Level ${level} of your epic journey.`,
      category,
      difficulty: diff,
      coinsReward: 50 * multiplier,
      gemsReward: multiplier,
      xpReward: 100 * multiplier,
      isPremium: diff === "legendary",
      isPublished: true,
      estimatedMinutes: 3 + multiplier * 2,
    };
  });

  await db.insert(storiesTable).values(stories).onConflictDoNothing();

  console.log("Seeding complete!");
  process.exit(0);
}

main().catch(err => {
  console.error("Seed error:", err);
  process.exit(1);
});
