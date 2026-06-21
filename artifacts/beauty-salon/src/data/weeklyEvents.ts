export type WeeklyEvent = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  bonusType: 'coins' | 'gems' | 'xp' | 'all';
  bonusMultiplier: number;
  challengeType: string;
  color: string;
};

export const WEEKLY_EVENTS: WeeklyEvent[] = [
  {
    id: "bridal_week",
    name: "Bridal Bonanza",
    emoji: "💍",
    description: "Wedding season is here! Bridal challenges give 2x coins all week.",
    bonusType: "coins",
    bonusMultiplier: 2.0,
    challengeType: "bridal",
    color: "#FFB6C1",
  },
  {
    id: "celebrity_rush",
    name: "Celebrity Rush",
    emoji: "⭐",
    description: "A-listers flooding the city! Celebrity makeovers earn 3x gems.",
    bonusType: "gems",
    bonusMultiplier: 3.0,
    challengeType: "celebrity",
    color: "#FFD700",
  },
  {
    id: "fashion_festival",
    name: "Fashion Festival",
    emoji: "👗",
    description: "Fashion week fever! Style challenges award double XP.",
    bonusType: "xp",
    bonusMultiplier: 2.0,
    challengeType: "fashion",
    color: "#DA70D6",
  },
  {
    id: "vip_weekend",
    name: "VIP Weekend",
    emoji: "💎",
    description: "VIP clients everywhere! All rewards doubled for 48 hours.",
    bonusType: "all",
    bonusMultiplier: 2.0,
    challengeType: "all",
    color: "#9370DB",
  },
  {
    id: "speed_blitz",
    name: "Speed Blitz",
    emoji: "⚡",
    description: "Rapid service challenge! Fast completions earn bonus coins.",
    bonusType: "coins",
    bonusMultiplier: 1.5,
    challengeType: "speed",
    color: "#FF6B35",
  },
  {
    id: "glam_gala",
    name: "Glam Gala",
    emoji: "🎉",
    description: "Annual beauty gala! All levels award extra gems and XP.",
    bonusType: "all",
    bonusMultiplier: 1.75,
    challengeType: "all",
    color: "#FF69B4",
  },
  {
    id: "spa_sunday",
    name: "Spa Sunday",
    emoji: "🛁",
    description: "Relaxation special — classic challenges earn 2.5x coins today.",
    bonusType: "coins",
    bonusMultiplier: 2.5,
    challengeType: "classic",
    color: "#98FB98",
  },
];

export function getCurrentEvent(): WeeklyEvent {
  const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  return WEEKLY_EVENTS[weekNumber % WEEKLY_EVENTS.length];
}
