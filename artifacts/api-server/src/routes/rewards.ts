import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, spinPrizesTable, adConfigsTable, adWatchLogsTable } from "@workspace/db";
import { eq, count, and, gte, sql } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import { logger } from "../lib/logger";

const router = Router();

router.get("/rewards/daily", requireAuth, async (req, res) => {
  try {
    const user = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
    if (!user[0]) return res.status(404).json({ error: "Not found" });

    const now = new Date();
    const lastClaim = user[0].lastDailyRewardAt;
    const canClaim = !lastClaim || (now.getTime() - new Date(lastClaim).getTime()) >= 24 * 60 * 60 * 1000;

    const weekSchedule = Array.from({ length: 7 }, (_, i) => ({
      day: i + 1,
      coins: 50 + i * 25,
      gems: i === 6 ? 5 : 1,
      isClaimed: i < user[0].currentStreak,
      isToday: i === user[0].currentStreak,
    }));

    return res.json({
      canClaim,
      streak: user[0].currentStreak,
      nextClaimAt: canClaim ? null : new Date(new Date(lastClaim!).getTime() + 24 * 60 * 60 * 1000).toISOString(),
      weekSchedule,
    });
  } catch (err) {
    logger.error({ err }, "getDailyRewardStatus error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/rewards/daily/claim", requireAuth, async (req, res) => {
  try {
    const user = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
    if (!user[0]) return res.status(404).json({ error: "Not found" });

    const now = new Date();
    const lastClaim = user[0].lastDailyRewardAt;
    const canClaim = !lastClaim || (now.getTime() - new Date(lastClaim).getTime()) >= 24 * 60 * 60 * 1000;

    if (!canClaim) return res.status(400).json({ error: "Already claimed today" });

    const day = user[0].currentStreak % 7;
    const coinsEarned = 50 + day * 25;
    const gemsEarned = day === 6 ? 5 : 1;
    const newStreak = user[0].currentStreak + 1;

    await db.update(usersTable).set({
      coins: user[0].coins + coinsEarned,
      gems: user[0].gems + gemsEarned,
      currentStreak: newStreak,
      longestStreak: Math.max(user[0].longestStreak, newStreak),
      lastDailyRewardAt: now,
    }).where(eq(usersTable.id, req.userId!));

    return res.json({
      coinsEarned,
      gemsEarned,
      streak: newStreak,
      newBalance: {
        coins: user[0].coins + coinsEarned,
        gems: user[0].gems + gemsEarned,
        xp: user[0].xp,
        level: user[0].level,
      },
    });
  } catch (err) {
    logger.error({ err }, "claimDailyReward error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/rewards/spin", requireAuth, async (req, res) => {
  try {
    const prizes = await db.select().from(spinPrizesTable).where(eq(spinPrizesTable.isActive, true));

    if (prizes.length === 0) {
      const defaultPrizes = [
        { id: 1, label: "50 Coins", type: "coins", value: 50, probability: 0.3, color: "#f59e0b" },
        { id: 2, label: "100 Coins", type: "coins", value: 100, probability: 0.25, color: "#f97316" },
        { id: 3, label: "5 Gems", type: "gems", value: 5, probability: 0.15, color: "#8b5cf6" },
        { id: 4, label: "200 Coins", type: "coins", value: 200, probability: 0.12, color: "#ef4444" },
        { id: 5, label: "10 Gems", type: "gems", value: 10, probability: 0.08, color: "#6366f1" },
        { id: 6, label: "Miss", type: "miss", value: 0, probability: 0.05, color: "#6b7280" },
        { id: 7, label: "2x Multiplier", type: "multiplier", value: 2, probability: 0.03, color: "#10b981" },
        { id: 8, label: "500 Coins", type: "coins", value: 500, probability: 0.02, color: "#ec4899" },
      ];
      return res.json({ freeSpinsAvailable: 1, paidSpinCost: 50, prizes: defaultPrizes });
    }

    return res.json({
      freeSpinsAvailable: 1,
      paidSpinCost: 50,
      prizes: prizes.map(p => ({ ...p, probability: parseFloat(String(p.probability)) })),
    });
  } catch (err) {
    logger.error({ err }, "getSpinStatus error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/rewards/spin/execute", requireAuth, async (req, res) => {
  try {
    const user = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
    if (!user[0]) return res.status(404).json({ error: "Not found" });

    const prizes = [
      { id: 1, label: "50 Coins", type: "coins", value: 50, probability: 0.3, color: "#f59e0b" },
      { id: 2, label: "100 Coins", type: "coins", value: 100, probability: 0.25, color: "#f97316" },
      { id: 3, label: "5 Gems", type: "gems", value: 5, probability: 0.15, color: "#8b5cf6" },
      { id: 4, label: "200 Coins", type: "coins", value: 200, probability: 0.12, color: "#ef4444" },
      { id: 5, label: "10 Gems", type: "gems", value: 10, probability: 0.08, color: "#6366f1" },
      { id: 6, label: "Miss", type: "miss", value: 0, probability: 0.05, color: "#6b7280" },
      { id: 7, label: "2x Multiplier", type: "multiplier", value: 2, probability: 0.03, color: "#10b981" },
      { id: 8, label: "500 Coins", type: "coins", value: 500, probability: 0.02, color: "#ec4899" },
    ];

    const rand = Math.random();
    let cumulative = 0;
    let prizeIndex = 0;
    for (let i = 0; i < prizes.length; i++) {
      cumulative += prizes[i].probability;
      if (rand <= cumulative) { prizeIndex = i; break; }
    }
    const prize = prizes[prizeIndex];

    let newCoins = user[0].coins;
    let newGems = user[0].gems;
    if (prize.type === "coins") newCoins += prize.value;
    if (prize.type === "gems") newGems += prize.value;

    await db.update(usersTable).set({ coins: newCoins, gems: newGems }).where(eq(usersTable.id, req.userId!));

    return res.json({
      prizeIndex,
      prize,
      newBalance: { coins: newCoins, gems: newGems, xp: user[0].xp, level: user[0].level },
    });
  } catch (err) {
    logger.error({ err }, "executeSpin error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/rewards/ad-watch", requireAuth, async (req, res) => {
  try {
    const user = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
    if (!user[0]) return res.status(404).json({ error: "Not found" });

    const coinsEarned = 20;
    const gemsEarned = 0;
    await db.update(usersTable).set({ coins: user[0].coins + coinsEarned }).where(eq(usersTable.id, req.userId!));

    return res.json({
      coinsEarned,
      gemsEarned,
      newBalance: { coins: user[0].coins + coinsEarned, gems: user[0].gems, xp: user[0].xp, level: user[0].level },
    });
  } catch (err) {
    logger.error({ err }, "recordAdWatch error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
