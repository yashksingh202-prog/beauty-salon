import React, { createContext, useContext, useCallback } from "react";
import { useGameStore, User, Progress, RewardsState, LeaderboardEntry, AdminSettings } from "@/hooks/useGameStore";
import { ACHIEVEMENTS, Achievement } from "@/data/achievements";
import { SalonUpgradesState, getUpgradeBonus, getUpgradeCost, SALON_UPGRADES } from "@/data/salonUpgrades";
import { getCurrentEvent } from "@/data/weeklyEvents";

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
  logout: () => void;

  addCoins: (amount: number) => void;
  addGems: (amount: number) => void;
  addXP: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  spendGems: (amount: number) => boolean;

  completeLevel: (levelId: number, stars: number, score: number, challengeType: string, isVIP: boolean, coinsEarned: number, gemsEarned: number, xpEarned: number) => void;
  claimDailyReward: () => { success: boolean; coins?: number; message?: string };
  executeSpin: () => { label: string; coins: number; gems: number; type: string };

  unlockAchievement: (achievementId: string) => void;
  checkAchievements: () => string[];

  upgradeSalon: (upgradeId: keyof SalonUpgradesState) => { success: boolean; error?: string };
  renameSalon: (name: string) => void;

  getCoinMultiplier: () => number;
  getGemMultiplier: () => number;
  getQualityBonus: () => number;

  purchaseShopItem: (itemId: string, cost: number) => boolean;

  adminBanUser: (userId: string) => void;
  adminUnbanUser: (userId: string) => void;
  adminAdjustCoins: (userId: string, amount: number) => void;
  adminUpdateSettings: (settings: AdminSettings) => void;
};

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const store = useGameStore();

  const login = useCallback((username: string, password: string) => {
    const users: User[] = JSON.parse(localStorage.getItem("empire_users") ?? "[]");
    if (username === "admin" && password === "glamstar2024") {
      const adminUser: User = {
        id: "admin", username: "Admin", password: "glamstar2024",
        avatar: "avatar8", coins: 999999, gems: 9999, level: 100, xp: 99999,
        streak: 0, lastLogin: new Date().toISOString(), achievements: [], completedLevels: {},
        totalCoinsEarned: 0, totalGemsEarned: 0, gamesPlayed: 0, isBanned: false, isAdmin: true,
        salonName: "Admin HQ", salonUpgrades: { chair:5, mirror:5, products:5, reception:5, lighting:5 },
        shopPurchases: [], totalPerfectLevels: 0, bridalCompleted: 0, celebrityCompleted: 0, fashionCompleted: 0, vipServed: 0,
      };
      store.saveUser(adminUser);
      return { success: true };
    }
    const found = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
    if (!found) return { success: false, error: "Invalid username or password" };
    if (found.isBanned) return { success: false, error: "This account has been banned" };
    store.saveUser({ ...found, lastLogin: new Date().toISOString() });
    return { success: true };
  }, [store]);

  const logout = useCallback(() => {
    store.setCurrentUser(null);
    localStorage.removeItem("empire_current_user_id");
  }, [store]);

  const getCoinMultiplier = useCallback(() => {
    if (!store.currentUser) return 1;
    const receptionBonus = getUpgradeBonus(store.currentUser.salonUpgrades, 'reception') / 100;
    const event = getCurrentEvent();
    const eventBonus = (event.bonusType === 'coins' || event.bonusType === 'all') ? event.bonusMultiplier - 1 : 0;
    return 1 + receptionBonus + eventBonus;
  }, [store]);

  const getGemMultiplier = useCallback(() => {
    if (!store.currentUser) return 1;
    const lightingBonus = getUpgradeBonus(store.currentUser.salonUpgrades, 'lighting') / 100;
    const event = getCurrentEvent();
    const eventBonus = (event.bonusType === 'gems' || event.bonusType === 'all') ? event.bonusMultiplier - 1 : 0;
    return 1 + lightingBonus + eventBonus;
  }, [store]);

  const getQualityBonus = useCallback(() => {
    if (!store.currentUser) return 0;
    return getUpgradeBonus(store.currentUser.salonUpgrades, 'mirror');
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
    const xpPerLevel = 200;
    let newXP = store.currentUser.xp + amount;
    let newLevel = store.currentUser.level;
    while (newXP >= newLevel * xpPerLevel) {
      newXP -= newLevel * xpPerLevel;
      newLevel++;
    }
    store.saveUser({ ...store.currentUser, xp: newXP, level: newLevel });
  }, [store]);

  const spendCoins = useCallback((amount: number): boolean => {
    if (!store.currentUser || store.currentUser.coins < amount) return false;
    store.saveUser({ ...store.currentUser, coins: store.currentUser.coins - amount });
    return true;
  }, [store]);

  const spendGems = useCallback((amount: number): boolean => {
    if (!store.currentUser || store.currentUser.gems < amount) return false;
    store.saveUser({ ...store.currentUser, gems: store.currentUser.gems - amount });
    return true;
  }, [store]);

  const completeLevel = useCallback((
    levelId: number, stars: number, score: number,
    challengeType: string, isVIP: boolean,
    coinsEarned: number, gemsEarned: number, xpEarned: number
  ) => {
    if (!store.currentUser) return;
    const key = String(levelId);
    const prev = store.currentUser.completedLevels[key];
    const bestStars = prev ? Math.max(prev.stars, stars) : stars;
    const bestScore = prev ? Math.max(prev.score, score) : score;

    const nextLevel = Math.max(store.progress.currentLevel, levelId + 1);

    const updated: User = {
      ...store.currentUser,
      completedLevels: { ...store.currentUser.completedLevels, [key]: { stars: bestStars, score: bestScore } },
      coins: store.currentUser.coins + coinsEarned,
      totalCoinsEarned: store.currentUser.totalCoinsEarned + coinsEarned,
      gems: store.currentUser.gems + gemsEarned,
      totalGemsEarned: store.currentUser.totalGemsEarned + gemsEarned,
      gamesPlayed: store.currentUser.gamesPlayed + 1,
      totalPerfectLevels: store.currentUser.totalPerfectLevels + (stars === 3 && !prev?.stars ? 1 : 0),
      bridalCompleted: store.currentUser.bridalCompleted + (challengeType === 'bridal' ? 1 : 0),
      celebrityCompleted: store.currentUser.celebrityCompleted + (challengeType === 'celebrity' ? 1 : 0),
      fashionCompleted: store.currentUser.fashionCompleted + (challengeType === 'fashion' ? 1 : 0),
      vipServed: store.currentUser.vipServed + (isVIP ? 1 : 0),
    };
    store.saveUser(updated);
    store.saveProgress({
      ...store.progress,
      currentLevel: nextLevel,
      highScores: { ...store.progress.highScores, [key]: bestScore },
      levelStars: { ...store.progress.levelStars, [key]: bestStars },
    });
    addXP(xpEarned);
    store.updateLeaderboard(updated);
  }, [store, addXP]);

  const claimDailyReward = useCallback(() => {
    if (!store.currentUser) return { success: false, message: "Not logged in" };
    const today = new Date().toDateString();
    if (store.rewards.lastDailyClaim === today) return { success: false, message: "Already claimed today!" };
    const streak = (store.rewards.streak % 7) + 1;
    const amounts = store.adminSettings.dailyRewardCoins;
    const coins = amounts[streak - 1] ?? amounts[0];
    addCoins(coins);
    store.saveRewards({ ...store.rewards, lastDailyClaim: today, streak, dailyClaimCount: store.rewards.dailyClaimCount + 1 });
    return { success: true, coins };
  }, [store, addCoins]);

  const executeSpin = useCallback(() => {
    const prizes = store.adminSettings.spinPrizes;
    const prize = prizes[Math.floor(Math.random() * prizes.length)];
    if (prize.coins) addCoins(prize.coins);
    if (prize.gems) addGems(prize.gems);
    store.saveRewards({ ...store.rewards, lastSpin: new Date().toDateString() });
    return prize;
  }, [store, addCoins, addGems]);

  const unlockAchievement = useCallback((achievementId: string) => {
    if (!store.currentUser) return;
    if (store.currentUser.achievements.includes(achievementId)) return;
    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
    const updated = { ...store.currentUser, achievements: [...store.currentUser.achievements, achievementId] };
    store.saveUser(updated);
    if (achievement) {
      if (achievement.rewardCoins > 0) addCoins(achievement.rewardCoins);
      if (achievement.rewardGems > 0) addGems(achievement.rewardGems);
    }
  }, [store, addCoins, addGems]);

  const checkAchievements = useCallback((): string[] => {
    if (!store.currentUser) return [];
    const u = store.currentUser;
    const completed = Object.keys(u.completedLevels).length;
    const perfectLevels = Object.values(u.completedLevels).filter(l => l.stars === 3).length;

    const checks: [string, boolean][] = [
      ["first_customer",   u.gamesPlayed >= 1],
      ["level_5",          u.level >= 5],
      ["level_10",         u.level >= 10],
      ["level_25",         u.level >= 25],
      ["level_50",         u.level >= 50],
      ["level_100",        u.level >= 100],
      ["complete_1",       completed >= 1],
      ["complete_10",      completed >= 10],
      ["complete_25",      completed >= 25],
      ["complete_50",      completed >= 50],
      ["complete_100",     completed >= 100],
      ["complete_500",     completed >= 500],
      ["perfect_1",        perfectLevels >= 1],
      ["perfect_10",       perfectLevels >= 10],
      ["perfect_50",       perfectLevels >= 50],
      ["coins_500",        u.totalCoinsEarned >= 500],
      ["coins_5000",       u.totalCoinsEarned >= 5000],
      ["coins_50000",      u.totalCoinsEarned >= 50000],
      ["first_gem",        u.totalGemsEarned >= 1],
      ["gems_25",          u.totalGemsEarned >= 25],
      ["streak_3",         u.streak >= 3],
      ["streak_7",         u.streak >= 7],
      ["streak_30",        u.streak >= 30],
      ["daily_7",          store.rewards.dailyClaimCount >= 7],
      ["daily_30",         store.rewards.dailyClaimCount >= 30],
      ["bridal_5",         u.bridalCompleted >= 5],
      ["celebrity_3",      u.celebrityCompleted >= 3],
      ["fashion_5",        u.fashionCompleted >= 5],
      ["vip_10",           u.vipServed >= 10],
      ["first_upgrade",    Object.values(u.salonUpgrades).some(l => l > 1)],
      ["max_upgrade",      Object.values(u.salonUpgrades).some(l => l >= 5)],
      ["all_upgrades",     Object.values(u.salonUpgrades).every(l => l >= 5)],
      ["shop_spree",       (u.shopPurchases?.length ?? 0) >= 5],
    ];

    const newOnes = checks
      .filter(([id, cond]) => cond && !u.achievements.includes(id))
      .map(([id]) => id);

    newOnes.forEach(id => unlockAchievement(id));
    return newOnes;
  }, [store, unlockAchievement]);

  const upgradeSalon = useCallback((upgradeId: keyof SalonUpgradesState) => {
    if (!store.currentUser) return { success: false, error: "Not logged in" };
    const currentLevel = store.currentUser.salonUpgrades[upgradeId] ?? 1;
    const upg = SALON_UPGRADES.find(u => u.id === upgradeId);
    if (!upg) return { success: false, error: "Invalid upgrade" };
    if (currentLevel >= upg.maxLevel) return { success: false, error: "Already at max level!" };
    const cost = getUpgradeCost(upgradeId, currentLevel + 1);
    if (store.currentUser.coins < cost) return { success: false, error: `Need ${cost} coins` };
    const updated: User = {
      ...store.currentUser,
      coins: store.currentUser.coins - cost,
      salonUpgrades: { ...store.currentUser.salonUpgrades, [upgradeId]: currentLevel + 1 },
    };
    store.saveUser(updated);
    return { success: true };
  }, [store]);

  const renameSalon = useCallback((name: string) => {
    if (!store.currentUser) return;
    store.saveUser({ ...store.currentUser, salonName: name });
  }, [store]);

  const purchaseShopItem = useCallback((itemId: string, cost: number): boolean => {
    if (!store.currentUser) return false;
    if (store.currentUser.coins < cost) return false;
    const updated: User = {
      ...store.currentUser,
      coins: store.currentUser.coins - cost,
      shopPurchases: [...(store.currentUser.shopPurchases ?? []), itemId],
    };
    store.saveUser(updated);
    return true;
  }, [store]);

  const adminBanUser = useCallback((userId: string) => {
    const users: User[] = JSON.parse(localStorage.getItem("empire_users") ?? "[]");
    const updated = users.map(u => u.id === userId ? { ...u, isBanned: true } : u);
    localStorage.setItem("empire_users", JSON.stringify(updated));
    store.setUsers(updated);
  }, [store]);

  const adminUnbanUser = useCallback((userId: string) => {
    const users: User[] = JSON.parse(localStorage.getItem("empire_users") ?? "[]");
    const updated = users.map(u => u.id === userId ? { ...u, isBanned: false } : u);
    localStorage.setItem("empire_users", JSON.stringify(updated));
    store.setUsers(updated);
  }, [store]);

  const adminAdjustCoins = useCallback((userId: string, amount: number) => {
    const users: User[] = JSON.parse(localStorage.getItem("empire_users") ?? "[]");
    const updated = users.map(u => u.id === userId ? { ...u, coins: Math.max(0, u.coins + amount) } : u);
    localStorage.setItem("empire_users", JSON.stringify(updated));
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
    login, logout,
    addCoins, addGems, addXP, spendCoins, spendGems,
    completeLevel, claimDailyReward, executeSpin,
    unlockAchievement, checkAchievements,
    upgradeSalon, renameSalon,
    getCoinMultiplier, getGemMultiplier, getQualityBonus,
    purchaseShopItem,
    adminBanUser, adminUnbanUser, adminAdjustCoins, adminUpdateSettings,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}

export { ACHIEVEMENTS };
export type { Achievement };
