export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first_play",      name: "First Glam",       description: "Complete your first makeover",         icon: "Sparkles",    requirement: "complete_1_level" },
  { id: "first_shave",     name: "Smooth Operator",   description: "Complete a shaving step",              icon: "Scissors",    requirement: "complete_shaving" },
  { id: "nail_painter",    name: "Nail Artist",        description: "Complete a nail painting step",        icon: "Palette",     requirement: "complete_nails" },
  { id: "level_5",         name: "Getting Started",    description: "Reach level 5",                       icon: "Star",        requirement: "reach_level_5" },
  { id: "level_10",        name: "Glam Pro",           description: "Reach level 10",                      icon: "Trophy",      requirement: "reach_level_10" },
  { id: "level_25",        name: "Beauty Queen",       description: "Reach level 25",                      icon: "Crown",       requirement: "reach_level_25" },
  { id: "level_50",        name: "Makeover Master",    description: "Reach level 50",                      icon: "Crown",       requirement: "reach_level_50" },
  { id: "streak_3",        name: "3-Day Streak",       description: "Log in 3 days in a row",              icon: "Flame",       requirement: "streak_3" },
  { id: "streak_7",        name: "Streak Master",      description: "Log in 7 days in a row",              icon: "Flame",       requirement: "streak_7" },
  { id: "streak_30",       name: "Dedicated Glamster", description: "Log in 30 days in a row",             icon: "Flame",       requirement: "streak_30" },
  { id: "coins_100",       name: "Coin Collector",     description: "Earn 100 coins",                      icon: "Coins",       requirement: "earn_100_coins" },
  { id: "coins_1000",      name: "Coin Hoarder",       description: "Earn 1,000 coins total",              icon: "Coins",       requirement: "earn_1000_coins" },
  { id: "coins_10000",     name: "Coin Millionaire",   description: "Earn 10,000 coins total",             icon: "Coins",       requirement: "earn_10000_coins" },
  { id: "first_gem",       name: "Gem Hunter",         description: "Earn your first gem",                 icon: "Gem",         requirement: "earn_1_gem" },
  { id: "gems_10",         name: "Gem Collector",      description: "Earn 10 gems",                        icon: "Gem",         requirement: "earn_10_gems" },
  { id: "complete_5",      name: "Salon Regular",      description: "Complete 5 makeovers",                icon: "Scissors",    requirement: "complete_5_levels" },
  { id: "complete_10",     name: "Makeover Queen",     description: "Complete 10 makeovers",               icon: "Scissors",    requirement: "complete_10_levels" },
  { id: "complete_25",     name: "Glam Guru",          description: "Complete 25 makeovers",               icon: "Scissors",    requirement: "complete_25_levels" },
  { id: "complete_50",     name: "Legend",             description: "Complete 50 makeovers",               icon: "Trophy",      requirement: "complete_50_levels" },
  { id: "complete_100",    name: "Hall of Fame",        description: "Complete all 100 levels!",           icon: "Trophy",      requirement: "complete_100_levels" },
  { id: "first_spin",      name: "Lucky Spinner",      description: "Use the lucky spin wheel",            icon: "RefreshCw",   requirement: "use_spin" },
  { id: "three_stars",     name: "Perfection",         description: "Get 3 stars on any level",            icon: "Star",        requirement: "three_stars_any" },
  { id: "five_perfect",    name: "Flawless",           description: "Get 3 stars on 5 levels",             icon: "Star",        requirement: "three_stars_5" },
  { id: "speed_run",       name: "Speed Stylist",      description: "Complete a level in under 30 seconds",icon: "Zap",         requirement: "complete_under_30s" },
  { id: "makeover_artist", name: "Makeover Artist",    description: "Complete a makeup step",              icon: "Palette",     requirement: "complete_makeup" },
  { id: "hairstylist",     name: "Hairstylist",        description: "Complete a hair styling step",        icon: "Wind",        requirement: "complete_hairstyle" },
  { id: "fashionista",     name: "Fashionista",        description: "Complete an outfit step",             icon: "Shirt",       requirement: "complete_outfit" },
  { id: "daily_devotee",   name: "Daily Devotee",      description: "Claim 7 daily rewards",               icon: "CalendarCheck",requirement: "claim_7_daily" },
  { id: "shop_visitor",    name: "Shopaholic",         description: "Visit the shop",                      icon: "ShoppingBag", requirement: "visit_shop" },
  { id: "referral",        name: "Social Butterfly",   description: "Refer a friend (share your code)",    icon: "Users",       requirement: "visit_profile" },
];
