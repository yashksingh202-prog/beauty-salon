import React, { createContext, useContext, useCallback } from "react";
import { useGameStore, User, Progress, RewardsState, LeaderboardEntry, AdminSettings } from "@/hooks/useGameStore";
import { ACHIEVEMENTS } from "@/data/achievements";

type GameContextType = {
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  progress: Progress;
  rewards: RewardsState;
  leaderboard: LeaderboardEntry[];
  adminSettings: AdminSettings;
  allUsers: User[];

  login: (username: string, password: string) => { success: boolean; error?: string };
  register: (username: string, password: string, avatar: string) => { success: boolean; error?: string };
  logout: () => void;

  addCoins: (amount: number) => void;
  addGems: (amount: number) => void;
  addXP: (amount: number) => void;

  completeLevel: (levelId: string, stars: number, coinsEarned: number) => void;
  claimDailyReward: () => { success: boolean; coins?: number; message?: string };
  executeSpin: () => { label: string; coins: number; gems: number; type: string };

  unlockAchievement: (achievementId: string) => void;
  checkAchievements: () => void;

  adminBanUser: (userId: string) => void;
  adminUnbanUser: (userId: string) => void;
  adminAdjustCoins: (userId: string, amount: number) => void;
  adminUpdateSettings: (settings: AdminSettings) => void;
};

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const store = useGameStore();

  const login = useCallback((username: string, password: string) => {
    const users: User[] = JSON.parse(localStorage.getItem("glamstar_users") ?? "[]");

    if (username === "admin" && password === "glamstar2024") {
      const adminUser: User = {
        id: "admin", username: "Admin", password: "glamstar2024",
        avatar: "avatar8", coins: 999999, gems: 9999,
        level: 100, xp: 99999, streak: 0, lastLogin: new Date().toISOString(),
        achievements: [], completedLevels: {}, totalCoinsEarned: 0,
        totalGemsEarned: 0, gamesPlayed: 0, isBanned: false, isAdmin: true,
      };
      store.setCurrentUser(adminUser);
      return { success: true };
    }

    const found = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
    if (!found) return { success: false, error: "Invalid username or password" };
    if (found.isBanned) return { success: false, error: "This account has been banned" };

    const today = new Date().toDateString();
    const lastLogin = found.lastLogin ? new Date(found.lastLogin).toDateString() : null;
    let newStreak = found.streak;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (lastLogin === yesterday.toDateString()) newStreak = found.streak + 1;
    else if (lastLogin !== today) newStreak = 1;

    const updated = { ...found, lastLogin: new Date().toISOString(), streak: newStreak };
    store.setcurrent(updated);

    const storedProg = localStorage.getItem(`glamstar_progress_${found.id}`);
    if (storedProg) store.saveProgress(JSON.parse(storedProg));
    const storedRew = localStorage.getItem(`glamstar_rewards_${found.id}`);
    if (storedRew) store.saveRewards(JSON.parse(storedRew));

    return { success: true };
  }, [store]);

  const register = useCallback((username: string, password: string, avatar: string) => {
    if (!username.trim() || username.length < 3) return { success: false, error: "Username must be at least 3 characters" };
    if (!password || password.length < 4) return { success: false, error: "Password must be at least 4 characters" };

    const users: User[] = JSON.parse(localStorage.getItem("glamstar_users") ?? "[]");
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, error: "Username already taken" };
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      username: username.trim(),
      password,
      avatar,
      coins: 100,
      gems: 0,
      level: 1,
      xp: 0,
      streak: 1,
      lastLogin: new Date().toISOString(),
      achievements: [],
      completedLevels: {},
      totalCoinsEarned: 100,
      totalGemsEarned: 0,
      gamesPlayed: 0,
      isBanned: false,
      isAdmin: false,
    };
    store.setCurrentUser(newUser);
    return { success: true };
  }, [store]);

  const logout = useCallback(() => {
    store.setCurrentUser(null);
    localStorage.removeItem("glamstar_current_user_id");
  }, [store]);

  const addCoins = useCallback((amount: number) => {
    if (!store.currentUser) return;
    const updated = {
      ...store.currentUser,
      coins: store.currentUser.coins + amount,
      totalCoinsEarned: store.currentUser.totalCoinsEarned + (amount > 0 ? amount : 0),
    };
    store.saveUser(updated);
    store.updateLeaderboard(updated);
  }, [store]);

  const addGems = useCallback((amount: number) => {
    if (!store.currentUser) return;
    const updated = {
      ...store.currentUser,
      gems: store.currentUser.gems + amount,
      totalGemsEarned: store.currentUser.totalGemsEarned + (amount > 0 ? amount : 0),
    };
    store.saveUser(updated);
    store.updateLeaderboard(updated);
  }, [store]);

  const addXP = useCallback((amount: number) => {
    if (!store.currentUser) return;
    const xpPerLevel = 100;
    let newXP = store.currentUser.xp + amount;
    let newLevel = store.currentUser.level;
    while (newXP >= newLevel * xpPerLevel) {
      newXP -= newLevel * xpPerLevel;
      newLevel++;
    }
    const updated = { ...store.currentUser, xp: newXP, level: newLevel };
    store.saveUser(updated);
  }, [store]);

  const completeLevel = useCallback((levelId: string, stars: number, coinsEarned: number) => {
    if (!store.currentUser) return;
    const prev = store.currentUser.completedLevels[levelId];
    const bestStars = prev ? Math.max(prev.stars, stars) : stars;
    const bestScore = prev ? Math.max(prev.score, coinsEarned) : coinsEarned;

    const completedLevels = { ...store.currentUser.completedLevels, [levelId]: { stars: bestStars, score: bestScore } };
    const nextLevelId = String(parseInt(levelId) + 1);

    const updated = {
      ...store.currentUser,
      completedLevels,
      coins: store.currentUser.coins + coinsEarned,
      totalCoinsEarned: store.currentUser.totalCoinsEarned + coinsEarned,
      gamesPlayed: store.currentUser.gamesPlayed + 1,
    };
    store.saveUser(updated);

    const unlockedLevels = [...store.progress.unlockedLevels];
    if (!unlockedLevels.includes(nextLevelId) && parseInt(nextLevelId) <= 100) {
      unlockedLevels.push(nextLevelId);
    }
    store.saveProgress({ ...store.progress, unlockedLevels });
    store.updateLeaderboard(updated);
  }, [store]);

  const claimDailyReward = useCallback(() => {
    if (!store.currentUser) return { success: false, message: "Not logged in" };
    const today = new Date().toDateString();
    if (store.rewards.lastDailyClaim === today) {
      return { success: false, message: "Already claimed today!" };
    }
    const streak = (store.rewards.streak % 7) + 1;
    const amounts = store.adminSettings.dailyRewardCoins;
    const coins = amounts[streak - 1] ?? amounts[0];

    addCoins(coins);
    store.saveRewards({
      ...store.rewards,
      lastDailyClaim: today,
      streak,
      dailyClaimCount: store.rewards.dailyClaimCount + 1,
    });
    return { success: true, coins };
  }, [store, addCoins]);

  const executeSpin = useCallback(() => {
    const prizes = store.adminSettings.spinPrizes;
    const idx = Math.floor(Math.random() * prizes.length);
    const prize = prizes[idx];
    if (prize.coins) addCoins(prize.coins);
    if (prize.gems) addGems(prize.gems);
    const today = new Date().toDateString();
    store.saveRewards({ ...store.rewards, lastSpin: today });
    return prize;
  }, [store, addCoins, addGems]);

  const unlockAchievement = useCallback((achievementId: string) => {
    if (!store.currentUser) return;
    if (store.currentUser.achievements.includes(achievementId)) return;
    const updated = { ...store.currentUser, achievements: [...store.currentUser.achievements, achievementId] };
    store.saveUser(updated);
  }, [store]);

  const checkAchievements = useCallback(() => {
    if (!store.currentUser) return;
    const u = store.currentUser;
    const completedCount = Object.keys(u.completedLevels).length;

    const checks: [string, boolean][] = [
      ["first_play",      completedCount >= 1],
      ["level_5",         u.level >= 5],
      ["level_10",        u.level >= 10],
      ["level_25",        u.level >= 25],
      ["level_50",        u.level >= 50],
      ["streak_3",        u.streak >= 3],
      ["streak_7",        u.streak >= 7],
      ["streak_30",       u.streak >= 30],
      ["coins_100",       u.totalCoinsEarned >= 100],
      ["coins_1000",      u.totalCoinsEarned >= 1000],
      ["coins_10000",     u.totalCoinsEarned >= 10000],
      ["first_gem",       u.totalGemsEarned >= 1],
      ["gems_10",         u.totalGemsEarned >= 10],
      ["complete_5",      completedCount >= 5],
      ["complete_10",     completedCount >= 10],
      ["complete_25",     completedCount >= 25],
      ["complete_50",     completedCount >= 50],
      ["complete_100",    completedCount >= 1000],
      ["daily_devotee",   store.rewards.dailyClaimCount >= 7],
    ];

    const newAchievements = checks
      .filter(([id, cond]) => cond && !u.achievements.includes(id))
      .map(([id]) => id);

    if (newAchievements.length > 0) {
      const updated = { ...u, achievements: [...u.achievements, ...newAchievements] };
      store.saveUser(updated);
    }
  }, [store]);

  const adminBanUser = useCallback((userId: string) => {
    const users: User[] = JSON.parse(localStorage.getItem("glamstar_users") ?? "[]");
    const updated = users.map(u => u.id === userId ? { ...u, isBanned: true } : u);
    localStorage.setItem("glamstar_users", JSON.stringify(updated));
    store.setUsers(updated);
  }, [store]);

  const adminUnbanUser = useCallback((userId: string) => {
    const users: User[] = JSON.parse(localStorage.getItem("glamstar_users") ?? "[]");
    const updated = users.map(u => u.id === userId ? { ...u, isBanned: false } : u);
    localStorage.setItem("glamstar_users", JSON.stringify(updated));
    store.setUsers(updated);
  }, [store]);

  const adminAdjustCoins = useCallback((userId: string, amount: number) => {
    const users: User[] = JSON.parse(localStorage.getItem("glamstar_users") ?? "[]");
    const updated = users.map(u => u.id === userId ? { ...u, coins: Math.max(0, u.coins + amount) } : u);
    localStorage.setItem("glamstar_users", JSON.stringify(updated));
    store.setUsers(updated);
  }, [store]);

  const adminUpdateSettings = useCallback((settings: AdminSettings) => {
    store.saveAdminSettings(settings);
  }, [store]);

  const value: GameContextType = {
    user: store.currentUser,
    isLoggedIn: !!store.currentUser,
    isAdmin: store.currentUser?.isAdmin ?? false,
    progress: store.progress,
    rewards: store.rewards,
    leaderboard: store.leaderboard,
    adminSettings: store.adminSettings,
    allUsers: store.users,
    login,
    register,
    logout,
    addCoins,
    addGems,
    addXP,
    completeLevel,
    claimDailyReward,
    executeSpin,
    unlockAchievement,
    checkAchievements,
    adminBanUser,
    adminUnbanUser,
    adminAdjustCoins,
    adminUpdateSettings,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}

export { ACHIEVEMENTS };
