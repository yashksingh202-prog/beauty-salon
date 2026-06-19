import { useEffect, useState } from "react";

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
  announcement?: string;
};

export type Progress = {
  currentLevel: string;
  unlockedLevels: string[];
  highScores: Record<string, number>;
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
};

export type AdminSettings = {
  dailyRewardCoins: number[];
  spinPrizes: { label: string; coins: number; gems: number; type: string }[];
  announcement: string;
};

const SEED_LEADERBOARD: LeaderboardEntry[] = [
  { id: "seed1",  username: "SparkleQueen",  score: 15000, level: 45, avatar: "avatar1" },
  { id: "seed2",  username: "GlamGirl22",    score: 12500, level: 38, avatar: "avatar2" },
  { id: "seed3",  username: "BeautyBoss",    score: 11200, level: 34, avatar: "avatar3" },
  { id: "seed4",  username: "NailArtPro",    score: 9800,  level: 29, avatar: "avatar4" },
  { id: "seed5",  username: "MakeupMagic",   score: 8500,  level: 25, avatar: "avatar5" },
  { id: "seed6",  username: "StyleStar",     score: 7200,  level: 21, avatar: "avatar6" },
  { id: "seed7",  username: "LashLove",      score: 6500,  level: 18, avatar: "avatar7" },
  { id: "seed8",  username: "PinkPrincess",  score: 5400,  level: 15, avatar: "avatar8" },
  { id: "seed9",  username: "SpaDayYay",     score: 4100,  level: 12, avatar: "avatar1" },
  { id: "seed10", username: "GlitterGlow",   score: 3200,  level: 9,  avatar: "avatar2" },
];

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  dailyRewardCoins: [50, 75, 100, 150, 200, 250, 500],
  spinPrizes: [
    { label: "50 Coins",     coins: 50,  gems: 0, type: "coins" },
    { label: "100 Coins",    coins: 100, gems: 0, type: "coins" },
    { label: "200 Coins",    coins: 200, gems: 0, type: "coins" },
    { label: "1 Gem",        coins: 0,   gems: 1, type: "gems" },
    { label: "3 Gems",       coins: 0,   gems: 3, type: "gems" },
    { label: "500 Coins",    coins: 500, gems: 0, type: "coins" },
    { label: "Try Again",    coins: 10,  gems: 0, type: "try_again" },
    { label: "2x XP Boost",  coins: 0,   gems: 0, type: "xp_boost" },
  ],
  announcement: "",
};

export const AVATAR_OPTIONS = [
  "avatar1","avatar2","avatar3","avatar4","avatar5","avatar6","avatar7","avatar8"
];

export const AVATAR_COLORS: Record<string, string> = {
  avatar1: "#FF6B9D", avatar2: "#C084FC", avatar3: "#FB923C",
  avatar4: "#34D399", avatar5: "#60A5FA", avatar6: "#F472B6",
  avatar7: "#A78BFA", avatar8: "#FBBF24",
};

export function useGameStore() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<Progress>({
    currentLevel: "1",
    unlockedLevels: Array.from({ length: 10 }, (_, i) => String(i + 1)),
    highScores: {},
  });
  const [rewards, setRewards] = useState<RewardsState>({
    lastDailyClaim: null,
    streak: 0,
    lastSpin: null,
    dailyClaimCount: 0,
  });
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(DEFAULT_ADMIN_SETTINGS);

  useEffect(() => {
    const storedUsers = localStorage.getItem("glamstar_users");
    const storedCurrentId = localStorage.getItem("glamstar_current_user_id");
    const storedLeaderboard = localStorage.getItem("glamstar_leaderboard");
    const storedAdmin = localStorage.getItem("glamstar_admin_settings");

    const parsedUsers: User[] = storedUsers ? JSON.parse(storedUsers) : [];
    setUsers(parsedUsers);

    if (storedCurrentId) {
      const user = parsedUsers.find(u => u.id === storedCurrentId) ?? null;
      if (user) {
        setCurrentUser(user);
        const storedProg = localStorage.getItem(`glamstar_progress_${user.id}`);
        if (storedProg) setProgress(JSON.parse(storedProg));
        const storedRew = localStorage.getItem(`glamstar_rewards_${user.id}`);
        if (storedRew) setRewards(JSON.parse(storedRew));
      }
    }

    if (storedLeaderboard) {
      setLeaderboard(JSON.parse(storedLeaderboard));
    } else {
      setLeaderboard(SEED_LEADERBOARD);
      localStorage.setItem("glamstar_leaderboard", JSON.stringify(SEED_LEADERBOARD));
    }

    if (storedAdmin) {
      setAdminSettings(JSON.parse(storedAdmin));
    } else {
      localStorage.setItem("glamstar_admin_settings", JSON.stringify(DEFAULT_ADMIN_SETTINGS));
    }
  }, []);

  const saveUser = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem("glamstar_current_user_id", user.id);
    setUsers(prev => {
      const updated = prev.filter(u => u.id !== user.id).concat(user);
      localStorage.setItem("glamstar_users", JSON.stringify(updated));
      return updated;
    });
  };

  const saveProgress = (prog: Progress) => {
    if (!currentUser) return;
    setProgress(prog);
    localStorage.setItem(`glamstar_progress_${currentUser.id}`, JSON.stringify(prog));
  };

  const saveRewards = (rew: RewardsState) => {
    if (!currentUser) return;
    setRewards(rew);
    localStorage.setItem(`glamstar_rewards_${currentUser.id}`, JSON.stringify(rew));
  };

  const saveAdminSettings = (settings: AdminSettings) => {
    setAdminSettings(settings);
    localStorage.setItem("glamstar_admin_settings", JSON.stringify(settings));
  };

  const updateLeaderboard = (user: User) => {
    const score = user.totalCoinsEarned + user.gems * 100 + Object.keys(user.completedLevels).length * 50;
    setLeaderboard(prev => {
      const filtered = prev.filter(e => e.id !== user.id);
      const updated = [...filtered, { id: user.id, username: user.username, score, level: user.level, avatar: user.avatar }]
        .sort((a, b) => b.score - a.score)
        .slice(0, 50);
      localStorage.setItem("glamstar_leaderboard", JSON.stringify(updated));
      return updated;
    });
  };

  return {
    users,
    currentUser,
    progress,
    rewards,
    leaderboard,
    adminSettings,
    saveUser,
    saveProgress,
    saveRewards,
    saveAdminSettings,
    updateLeaderboard,
    setCurrentUser,
    setUsers,
  };
}
