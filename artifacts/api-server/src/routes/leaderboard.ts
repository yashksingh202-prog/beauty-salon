import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { desc, count, sql } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import { logger } from "../lib/logger";

const router = Router();

router.get("/leaderboard", requireAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const type = (req.query.type as string) || "alltime";

    const users = await db.select({
      id: usersTable.id,
      username: usersTable.username,
      avatarUrl: usersTable.avatarUrl,
      level: usersTable.level,
      xp: usersTable.xp,
      isPremium: usersTable.isPremium,
      totalLevelsCompleted: usersTable.totalLevelsCompleted,
    }).from(usersTable)
      .where(sql`${usersTable.isBanned} = false`)
      .orderBy(desc(usersTable.xp))
      .limit(limit);

    const entries = users.map((u, i) => ({
      rank: i + 1,
      userId: u.id,
      username: u.username,
      avatarUrl: u.avatarUrl,
      score: u.xp,
      level: u.level,
      isPremium: u.isPremium,
    }));

    return res.json({ entries, type, updatedAt: new Date().toISOString() });
  } catch (err) {
    logger.error({ err }, "getLeaderboard error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/leaderboard/me", requireAuth, async (req, res) => {
  try {
    const allUsers = await db.select({ id: usersTable.id, xp: usersTable.xp })
      .from(usersTable)
      .where(sql`${usersTable.isBanned} = false`)
      .orderBy(desc(usersTable.xp));

    const myIndex = allUsers.findIndex(u => u.id === req.userId);
    const me = allUsers[myIndex];

    return res.json({
      rank: myIndex >= 0 ? myIndex + 1 : allUsers.length + 1,
      score: me?.xp || 0,
      totalPlayers: allUsers.length,
    });
  } catch (err) {
    logger.error({ err }, "getMyLeaderboardPosition error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
