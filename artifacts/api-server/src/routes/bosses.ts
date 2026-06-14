import { Router } from "express";
import { db } from "@workspace/db";
import { bossesTable, bossBattleLogsTable, usersTable } from "@workspace/db";
import { eq, and, gte, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import { logger } from "../lib/logger";

const router = Router();

router.get("/bosses", requireAuth, async (req, res) => {
  try {
    const bosses = await db.select().from(bossesTable).where(eq(bossesTable.isActive, true));

    const now = new Date();
    const result = [];
    for (const boss of bosses) {
      const lastBattle = await db.select().from(bossBattleLogsTable)
        .where(and(eq(bossBattleLogsTable.userId, req.userId!), eq(bossBattleLogsTable.bossId, boss.id)))
        .orderBy(desc(bossBattleLogsTable.battleAt))
        .limit(1);

      const lastBattleTime = lastBattle[0]?.battleAt;
      const cooldownMs = boss.cooldownHours * 60 * 60 * 1000;
      const isOnCooldown = lastBattleTime && (now.getTime() - new Date(lastBattleTime).getTime()) < cooldownMs;
      const cooldownUntil = isOnCooldown
        ? new Date(new Date(lastBattleTime!).getTime() + cooldownMs).toISOString()
        : null;

      const winCount = await db.select().from(bossBattleLogsTable)
        .where(and(eq(bossBattleLogsTable.bossId, boss.id), eq(bossBattleLogsTable.won, true), eq(bossBattleLogsTable.userId, req.userId!)));

      result.push({ ...boss, isDefeated: winCount.length > 0, cooldownUntil });
    }

    return res.json(result);
  } catch (err) {
    logger.error({ err }, "listBosses error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/bosses/:id/battle", requireAuth, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id));
    const boss = await db.select().from(bossesTable).where(eq(bossesTable.id, id)).limit(1);
    if (!boss[0]) return res.status(404).json({ error: "Boss not found" });

    const user = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
    if (!user[0]) return res.status(404).json({ error: "User not found" });

    const winChance = Math.min(0.3 + (user[0].level * 0.05), 0.8);
    const won = Math.random() < winChance;
    const damageDealt = Math.floor(Math.random() * boss[0].hp * 0.4) + boss[0].hp * 0.1;
    const coinsEarned = won ? boss[0].coinsReward : Math.floor(boss[0].coinsReward * 0.1);
    const gemsEarned = won ? boss[0].gemsReward : 0;
    const xpEarned = won ? boss[0].xpReward : Math.floor(boss[0].xpReward * 0.2);

    await db.insert(bossBattleLogsTable).values({ userId: req.userId!, bossId: id, won, damageDealt, coinsEarned, gemsEarned, xpEarned });
    await db.update(usersTable).set({
      coins: user[0].coins + coinsEarned,
      gems: user[0].gems + gemsEarned,
      xp: user[0].xp + xpEarned,
    }).where(eq(usersTable.id, req.userId!));

    return res.json({
      won,
      damageDealt: Math.floor(damageDealt),
      coinsEarned,
      gemsEarned,
      xpEarned,
      newBalance: { coins: user[0].coins + coinsEarned, gems: user[0].gems + gemsEarned, xp: user[0].xp + xpEarned, level: user[0].level },
    });
  } catch (err) {
    logger.error({ err }, "startBossBattle error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
