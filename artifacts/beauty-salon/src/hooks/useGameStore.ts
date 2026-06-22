import { useEffect, useState } from "react";
import { SalonUpgradesState, DEFAULT_SALON_UPGRADES } from "@/data/salonUpgrades";

export type User = {
  id: string;
  username: string;
  password: string;
  avatar: string;
  coins: number;
  gems: number;
  level: number;
  xp: number;
  streak: number;
  lastLogin: string;
  achievements: string[];
  completedLevels: Record<string, { stars: number; score: number }>;
  totalCoinsEarned: number;
  totalGemsEarned: number;
  gamesPlayed: number;
  isBanned: boolean;
  isAdmin: boolean;
  salonName: string;
  salonUpgrades: SalonUpgradesState;
  shopPurchases: string[];
  totalPerfectLevels: number;
  bridalCompleted: number;
  celebrityCompleted: number;
  fashionCompleted: number;
  vipServed: number;
};

export type Progress = {
  currentLevel: number;
  highScores: Record<string, number>;
  levelStars: Record<string, number>;
};

export type RewardsState = {
  lastDailyClaim: string | null;
  streak: number;
  lastSpin: string | null;
  dailyClaimCount: number;
};

export type LeaderboardEntry = {
  id: string;
  username: string;
  score: number;
  level: number;
  avatar: string;
  salonName: string;
};

export type AdminSettings = {
  dailyRewardCoins: number[];
  spinPrizes: { label: string; coins: number; gems: number; type: string }[];
  announcement: string;
};

const SEED_LEADERBOARD: LeaderboardEntry[] = [
  { id: "seed1",  username: "SparkleQueen",   score: 185000, level: 145, avatar: "avatar1", salonName: "Diamond Dreams" },
  { id: "seed2",  username: "GlamGirl22",     score: 142500, level: 98,  avatar: "avatar2", salonName: "Pink Palace" },
  { id: "seed3",  username: "BeautyBoss",     score: 121200, level: 84,  avatar: "avatar3", salonName: "Glam Central" },
  { id: "seed4",  username: "NailArtPro",     score: 98000,  level: 69,  avatar: "avatar4", salonName: "Nail Heaven" },
  { id: "seed5",  username: "MakeupMagic",    score: 85000,  level: 55,  avatar: "avatar5", salonName: "Magic Studio" },
  { id: "seed6",  username: "StyleStar",      score: 72000,  level: 41,  avatar: "avatar6", salonName: "Star Salon" },
  { id: "seed7",  username: "LashLove",       score: 65000,  level: 38,  avatar: "avatar7", salonName: "Lash Bar" },
  { id: "seed8",  username: "PinkPrincess",   score: 54000,  level: 25,  avatar: "avatar8", salonName: "Princess Suite" },
  { id: "seed9",  username: "SpaDayYay",      score: 41000,  level: 12,  avatar: "avatar1", salonName: "Spa Day" },
  { id: "seed10", username: "GlitterGlow",    score: 32000,  level: 9,   avatar: "avatar2", salonName: "Glitter Box" },
];

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  dailyRewardCoins: [100, 150, 200, 300, 400, 500, 1000],
  spinPrizes: [
    { label: "100 Coins",   coins: 100,  gems: 0, type: "coins" },
    { label: "250 Coins",   coins: 250,  gems: 0, type: "coins" },
    { label: "500 Coins",   coins: 500,  gems: 0, type: "coins" },
    { label: "1 Gem",       coins: 0,    gems: 1, type: "gems" },
    { label: "3 Gems",      coins: 0,    gems: 3, type: "gems" },
    { label: "1000 Coins",  coins: 1000, gems: 0, type: "coins" },
    { label: "Try Again",   coins: 50,   gems: 0, type: "try_again" },
    { label: "5 Gems",      coins: 0,    gems: 5, type: "gems" },
  ],
  announcement: "",
};

export const AVATAR_OPTIONS = ["avatar1","avatar2","avatar3","avatar4","avatar5","avatar6","avatar7","avatar8"];

export const AVATAR_COLORS: Record<string, string> = {
  avatar1: "#FF6B9D", avatar2: "#C084FC", avatar3: "#FB923C",
  avatar4: "#34D399", avatar5: "#60A5FA", avatar6: "#F472B6",
  avatar7: "#A78BFA", avatar8: "#FBBF24",
};

export const AVATAR_EMOJIS: Record<string, string> = {
  avatar1: "👩‍🦱", avatar2: "👩‍🦰", avatar3: "👩‍🦳",
  avatar4: "👩", avatar5: "🧕", avatar6: "👩‍🦲",
  avatar7: "🧑", avatar8: "👱‍♀️",
};

const GUEST_NAMES = ["StarPlayer","GlamQueen","BeautyPro","StyleIcon","SparkleGirl","GlowUp","PinkDiva","NailStar"];
const AVATAR_LIST = AVATAR_OPTIONS;
const SALON_NAMES = ["The Pink Studio","Glam Central","Beauty Empire","Sparkle Salon","Diamond Lash","Rose Gold Studio","The Glam Room","Chic & Shine"];

function createGuestUser(): User {
  const guestId = `guest_${Date.now()}`;
  return {
    id: guestId,
    username: GUEST_NAMES[Math.floor(Math.random() * GUEST_NAMES.length)],
    password: "",
    avatar: AVATAR_LIST[Math.floor(Math.random() * AVATAR_LIST.length)],
    coins: 500,
    gems: 5,
    level: 1,
    xp: 0,
    streak: 1,
    lastLogin: new Date().toISOString(),
    achievements: [],
    completedLevels: {},
    totalCoinsEarned: 500,
    totalGemsEarned: 5,
    gamesPlayed: 0,
    isBanned: false,
    isAdmin: false,
    salonName: SALON_NAMES[Math.floor(Math.random() * SALON_NAMES.length)],
    salonUpgrades: DEFAULT_SALON_UPGRADES,
    shopPurchases: [],
    totalPerfectLevels: 0,
    bridalCompleted: 0,
    celebrityCompleted: 0,
    fashionCompleted: 0,
    vipServed: 0,
  };
}

export function useGameStore() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<Progress>({ currentLevel: 1, highScores: {}, levelStars: {} });
  const [rewards, setRewards] = useState<RewardsState>({ lastDailyClaim: null, streak: 0, lastSpin: null, dailyClaimCount: 0 });
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(DEFAULT_ADMIN_SETTINGS);

  useEffect(() => {
    const storedUsers   = localStorage.getItem("empire_users");
    const storedId      = localStorage.getItem("empire_current_user_id");
    const storedLB      = localStorage.getItem("empire_leaderboard");
    const storedAdmin   = localStorage.getItem("empire_admin_settings");

    const parsedUsers: User[] = storedUsers ? JSON.parse(storedUsers) : [];
    setUsers(parsedUsers);

    if (storedId) {
      const user = parsedUsers.find(u => u.id === storedId);
      if (user) {
        // Migrate old users missing new fields (nullish coalescing preserves existing values)
        const migrated: User = {
          ...user,
          salonName:          user.salonName          ?? "My Salon",
          salonUpgrades:      user.salonUpgrades      ?? DEFAULT_SALON_UPGRADES,
          shopPurchases:      user.shopPurchases       ?? [],
          totalPerfectLevels: user.totalPerfectLevels  ?? 0,
          totalCoinsEarned:   user.totalCoinsEarned    ?? 0,
          totalGemsEarned:    user.totalGemsEarned     ?? 0,
          bridalCompleted:    user.bridalCompleted     ?? 0,
          celebrityCompleted: user.celebrityCompleted  ?? 0,
          fashionCompleted:   user.fashionCompleted    ?? 0,
          vipServed:          user.vipServed           ?? 0,
        };
        setCurrentUser(migrated);
        const prog = localStorage.getItem(`empire_progress_${user.id}`);
        if (prog) setProgress(JSON.parse(prog));
        const rew = localStorage.getItem(`empire_rewards_${user.id}`);
        if (rew) setRewards(JSON.parse(rew));
      }
    } else {
      const guest = createGuestUser();
      const updated = [...parsedUsers, guest];
      localStorage.setItem("empire_users", JSON.stringify(updated));
      localStorage.setItem("empire_current_user_id", guest.id);
      setUsers(updated);
      setCurrentUser(guest);
    }

    if (storedLB) {
      setLeaderboard(JSON.parse(storedLB));
    } else {
      setLeaderboard(SEED_LEADERBOARD);
      localStorage.setItem("empire_leaderboard", JSON.stringify(SEED_LEADERBOARD));
    }
    if (storedAdmin) {
      setAdminSettings(JSON.parse(storedAdmin));
    } else {
      localStorage.setItem("empire_admin_settings", JSON.stringify(DEFAULT_ADMIN_SETTINGS));
    }
  }, []);

  const saveUser = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem("empire_current_user_id", user.id);
    setUsers(prev => {
      const updated = prev.filter(u => u.id !== user.id).concat(user);
      localStorage.setItem("empire_users", JSON.stringify(updated));
      return updated;
    });
  };

  const saveProgress = (prog: Progress) => {
    if (!currentUser) return;
    setProgress(prog);
    localStorage.setItem(`empire_progress_${currentUser.id}`, JSON.stringify(prog));
  };

  const saveRewards = (rew: RewardsState) => {
    if (!currentUser) return;
    setRewards(rew);
    localStorage.setItem(`empire_rewards_${currentUser.id}`, JSON.stringify(rew));
  };

  const saveAdminSettings = (settings: AdminSettings) => {
    setAdminSettings(settings);
    localStorage.setItem("empire_admin_settings", JSON.stringify(settings));
  };

  const updateLeaderboard = (user: User) => {
    const score = user.totalCoinsEarned + user.gems * 500 + Object.keys(user.completedLevels).length * 100;
    setLeaderboard(prev => {
      const filtered = prev.filter(e => e.id !== user.id);
      const entry: LeaderboardEntry = {
        id: user.id,
        username: user.username,
        score,
        level: user.level,
        avatar: user.avatar,
        salonName: user.salonName ?? "My Salon",
      };
      const updated = [...filtered, entry].sort((a, b) => b.score - a.score).slice(0, 50);
      localStorage.setItem("empire_leaderboard", JSON.stringify(updated));
      return updated;
    });
  };

  return {
    users, currentUser, progress, rewards, leaderboard, adminSettings,
    saveUser, saveProgress, saveRewards, saveAdminSettings, updateLeaderboard,
    setCurrentUser, setUsers,
  };
}
