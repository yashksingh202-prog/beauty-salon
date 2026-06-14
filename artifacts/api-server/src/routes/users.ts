import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, userProgressTable, storiesTable, referralsTable } from "@workspace/db";
import { eq, sql, count } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import { getAuth } from "@clerk/express";
import { nanoid } from "nanoid";
import { logger } from "../lib/logger";

const router = Router();

function generateReferralCode(): string {
  return nanoid(8).toUpperCase();
}

router.post("/users/me/sync", async (req, res) => {
  try {
    const auth = getAuth(req);
    const clerkUserId = auth?.userId;
    if (!clerkUserId) return res.status(401).json({ error: "Unauthorized" });

    const sessionClaims = auth?.sessionClaims as Record<string, unknown> | undefined;
    const email = (sessionClaims?.email as string) || `${clerkUserId}@unknown.com`;
    const username = (sessionClaims?.username as string) ||
      (sessionClaims?.firstName as string) ||
      email.split("@")[0] ||
      `player_${clerkUserId.slice(-6)}`;
    const avatarUrl = sessionClaims?.imageUrl as string | undefined;

    const existing = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkUserId)).limit(1);
    if (existing[0]) {
      await db.update(usersTable).set({ lastLoginAt: new Date() }).where(eq(usersTable.clerkId, clerkUserId));
      return res.json(existing[0]);
    }

    let referralCode = generateReferralCode();
    let attempts = 0;
    while (attempts < 5) {
      const conflict = await db.select().from(usersTable).where(eq(usersTable.referralCode, referralCode)).limit(1);
      if (!conflict[0]) break;
      referralCode = generateReferralCode();
      attempts++;
    }

    const newUser = await db.insert(usersTable).values({
      clerkId: clerkUserId,
      username,
      email,
      avatarUrl: avatarUrl || null,
      referralCode,
      lastLoginAt: new Date(),
    }).returning();

    return res.json(newUser[0]);
  } catch (err) {
    logger.error({ err }, "syncUser error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/users/me", requireAuth, async (req, res) => {
  try {
    const user = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
    if (!user[0]) return res.status(404).json({ error: "Not found" });
    return res.json(user[0]);
  } catch (err) {
    logger.error({ err }, "getMyProfile error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/users/me", requireAuth, async (req, res) => {
  try {
    const { username, avatarUrl } = req.body;
    const updated = await db.update(usersTable)
      .set({ username, avatarUrl })
      .where(eq(usersTable.id, req.userId!))
      .returning();
    return res.json(updated[0]);
  } catch (err) {
    logger.error({ err }, "updateMyProfile error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/users/me/stats", requireAuth, async (req, res) => {
  try {
    const user = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
    if (!user[0]) return res.status(404).json({ error: "Not found" });

    const [progressCount] = await db.select({ count: count() }).from(userProgressTable).where(eq(userProgressTable.userId, req.userId!));
    const [referralCount] = await db.select({ count: count() }).from(referralsTable).where(eq(referralsTable.referrerId, req.userId!));

    return res.json({
      totalLevelsCompleted: progressCount.count,
      totalStoriesRead: progressCount.count,
      totalCoinsEarned: user[0].coins,
      totalGemsEarned: user[0].gems,
      currentStreak: user[0].currentStreak,
      longestStreak: user[0].longestStreak,
      bossesDefeated: 0,
      eventsParticipated: 0,
      totalSpins: 0,
      referralCount: referralCount.count,
    });
  } catch (err) {
    logger.error({ err }, "getMyStats error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
