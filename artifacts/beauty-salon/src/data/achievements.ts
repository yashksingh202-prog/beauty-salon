export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'progress' | 'currency' | 'streak' | 'mastery' | 'social' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  rewardCoins: number;
  rewardGems: number;
};

export const ACHIEVEMENTS: Achievement[] = [
  // Progress
  { id: "first_customer",    name: "First Client",        description: "Complete your very first makeover",             icon: "💄", category: "progress",  rarity: "common",    rewardCoins: 50,   rewardGems: 0 },
  { id: "level_5",           name: "Getting Glam",        description: "Reach player level 5",                         icon: "⭐", category: "progress",  rarity: "common",    rewardCoins: 100,  rewardGems: 0 },
  { id: "level_10",          name: "Beauty Pro",          description: "Reach player level 10",                        icon: "🌟", category: "progress",  rarity: "common",    rewardCoins: 200,  rewardGems: 1 },
  { id: "level_25",          name: "Glam Master",         description: "Reach player level 25",                        icon: "👑", category: "progress",  rarity: "rare",      rewardCoins: 500,  rewardGems: 2 },
  { id: "level_50",          name: "Style Icon",          description: "Reach player level 50",                        icon: "💎", category: "progress",  rarity: "epic",      rewardCoins: 1000, rewardGems: 5 },
  { id: "level_100",         name: "Beauty Legend",       description: "Reach player level 100",                       icon: "🏆", category: "progress",  rarity: "legendary", rewardCoins: 5000, rewardGems: 20 },

  // Levels completed
  { id: "complete_1",        name: "First Steps",         description: "Complete 1 salon level",                       icon: "🌸", category: "progress",  rarity: "common",    rewardCoins: 30,   rewardGems: 0 },
  { id: "complete_10",       name: "Dedicated Stylist",   description: "Complete 10 salon levels",                     icon: "✂️", category: "progress",  rarity: "common",    rewardCoins: 150,  rewardGems: 0 },
  { id: "complete_25",       name: "Glam Pro",            description: "Complete 25 salon levels",                     icon: "💅", category: "progress",  rarity: "rare",      rewardCoins: 400,  rewardGems: 1 },
  { id: "complete_50",       name: "Salon Veteran",       description: "Complete 50 salon levels",                     icon: "🏅", category: "progress",  rarity: "rare",      rewardCoins: 800,  rewardGems: 3 },
  { id: "complete_100",      name: "Century of Glamour",  description: "Complete 100 salon levels",                    icon: "💯", category: "progress",  rarity: "epic",      rewardCoins: 2000, rewardGems: 10 },
  { id: "complete_500",      name: "Empire Builder",      description: "Complete 500 salon levels",                    icon: "🌟", category: "mastery",   rarity: "legendary", rewardCoins: 10000,rewardGems: 50 },

  // 3-star mastery
  { id: "perfect_1",         name: "Perfectionist",       description: "Earn 3 stars on any level",                    icon: "⭐", category: "mastery",   rarity: "common",    rewardCoins: 75,   rewardGems: 0 },
  { id: "perfect_10",        name: "Star Collector",      description: "Earn 3 stars on 10 different levels",          icon: "🌟", category: "mastery",   rarity: "rare",      rewardCoins: 300,  rewardGems: 2 },
  { id: "perfect_50",        name: "Flawless",            description: "Earn 3 stars on 50 different levels",          icon: "💫", category: "mastery",   rarity: "epic",      rewardCoins: 1500, rewardGems: 8 },

  // Currency
  { id: "coins_500",         name: "Coin Collector",      description: "Earn a total of 500 coins",                    icon: "🪙", category: "currency",  rarity: "common",    rewardCoins: 50,   rewardGems: 0 },
  { id: "coins_5000",        name: "Money Maven",         description: "Earn a total of 5,000 coins",                  icon: "💰", category: "currency",  rarity: "rare",      rewardCoins: 200,  rewardGems: 1 },
  { id: "coins_50000",       name: "Coin Empress",        description: "Earn a total of 50,000 coins",                 icon: "💸", category: "currency",  rarity: "epic",      rewardCoins: 1000, rewardGems: 5 },
  { id: "first_gem",         name: "Gem Finder",          description: "Earn your first gem",                          icon: "💎", category: "currency",  rarity: "rare",      rewardCoins: 100,  rewardGems: 0 },
  { id: "gems_25",           name: "Gem Hoarder",         description: "Collect 25 gems total",                        icon: "👑", category: "currency",  rarity: "epic",      rewardCoins: 500,  rewardGems: 5 },

  // Streak
  { id: "streak_3",          name: "On a Roll",           description: "Log in 3 days in a row",                       icon: "🔥", category: "streak",    rarity: "common",    rewardCoins: 100,  rewardGems: 0 },
  { id: "streak_7",          name: "Week Warrior",        description: "Log in 7 days in a row",                       icon: "🔥", category: "streak",    rarity: "rare",      rewardCoins: 300,  rewardGems: 1 },
  { id: "streak_30",         name: "Monthly Maven",       description: "Log in 30 days in a row",                      icon: "🔥", category: "streak",    rarity: "epic",      rewardCoins: 1000, rewardGems: 5 },
  { id: "daily_7",           name: "Loyal Client",        description: "Claim daily rewards 7 times",                  icon: "📅", category: "streak",    rarity: "common",    rewardCoins: 150,  rewardGems: 0 },
  { id: "daily_30",          name: "Daily Devotee",       description: "Claim daily rewards 30 times",                 icon: "🗓️", category: "streak",    rarity: "rare",      rewardCoins: 500,  rewardGems: 3 },

  // Challenge-type mastery
  { id: "bridal_5",          name: "Wedding Whisperer",   description: "Complete 5 bridal challenges",                 icon: "💍", category: "mastery",   rarity: "rare",      rewardCoins: 400,  rewardGems: 2 },
  { id: "celebrity_3",       name: "Star Maker",          description: "Complete 3 celebrity makeovers",               icon: "⭐", category: "mastery",   rarity: "rare",      rewardCoins: 600,  rewardGems: 3 },
  { id: "fashion_5",         name: "Fashion Forward",     description: "Complete 5 fashion show challenges",           icon: "👗", category: "mastery",   rarity: "rare",      rewardCoins: 400,  rewardGems: 2 },
  { id: "vip_10",            name: "VIP Whisperer",       description: "Serve 10 VIP customers",                       icon: "💎", category: "mastery",   rarity: "epic",      rewardCoins: 1000, rewardGems: 5 },

  // Salon upgrades
  { id: "first_upgrade",     name: "Salon Investment",    description: "Purchase your first salon upgrade",            icon: "🪑", category: "special",   rarity: "common",    rewardCoins: 100,  rewardGems: 0 },
  { id: "max_upgrade",       name: "Five-Star Salon",     description: "Max out any salon upgrade to level 5",         icon: "🌟", category: "special",   rarity: "epic",      rewardCoins: 2000, rewardGems: 10 },
  { id: "all_upgrades",      name: "Empire Complete",     description: "Max out ALL salon upgrades",                   icon: "🏆", category: "special",   rarity: "legendary", rewardCoins: 9999, rewardGems: 30 },

  // Special
  { id: "spin_winner",       name: "Lucky Spin",          description: "Win gems from the spin wheel",                 icon: "🎰", category: "special",   rarity: "common",    rewardCoins: 50,   rewardGems: 0 },
  { id: "speed_demon",       name: "Speed Stylist",       description: "Complete a speed challenge",                   icon: "⚡", category: "special",   rarity: "rare",      rewardCoins: 300,  rewardGems: 1 },
  { id: "perfect_vip",       name: "VIP Perfection",      description: "Get 3 stars on a VIP celebrity level",         icon: "🌟", category: "special",   rarity: "epic",      rewardCoins: 2000, rewardGems: 8 },
  { id: "shop_spree",        name: "Shopping Queen",      description: "Make 5 purchases from the shop",              icon: "🛍️", category: "special",   rarity: "common",    rewardCoins: 200,  rewardGems: 0 },
  { id: "event_winner",      name: "Event Champion",      description: "Complete a special event level",               icon: "🎉", category: "special",   rarity: "rare",      rewardCoins: 500,  rewardGems: 3 },
];
