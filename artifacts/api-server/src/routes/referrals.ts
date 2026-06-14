import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, referralsTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import { logger } from "../lib/logger";

const router = Router();

router.get("/referrals/code", requireAuth, async (req, res) => {
  try {
    const user = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
    if (!user[0]) return res.status(404).json({ error: "Not found" });

    const referrals = await db.select({
      referredUserId: referralsTable.referredUserId,
      coinsEarned: referralsTable.coinsEarned,
      createdAt: referralsTable.createdAt,
    }).from(referralsTable).where(eq(referralsTable.referrerId, req.userId!));

    const [totalCoins] = await db.select({ total: count() }).from(referralsTable).where(eq(referralsTable.referrerId, req.userId!));

    const referralDetails = [];
    for (const r of referrals.slice(0, 10)) {
      const refUser = await db.select({ username: usersTable.username }).from(usersTable).where(eq(usersTable.id, r.referredUserId)).limit(1);
      if (refUser[0]) {
        referralDetails.push({ username: refUser[0].username, joinedAt: r.createdAt.toISOString(), coinsEarned: r.coinsEarned });
      }
    }

    return res.json({
      code: user[0].referralCode,
      totalReferrals: referrals.length,
      totalCoinsEarned: referrals.reduce((sum, r) => sum + r.coinsEarned, 0),
      referrals: referralDetails,
    });
  } catch (err) {
    logger.error({ err }, "getReferralCode error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/referrals/use", requireAuth, async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: "Code required" });

    const referrer = await db.select().from(usersTable).where(eq(usersTable.referralCode, code)).limit(1);
    if (!referrer[0]) return res.status(400).json({ error: "Invalid referral code" });
    if (referrer[0].id === req.userId) return res.status(400).json({ error: "Cannot use your own referral code" });

    const existing = await db.select().from(referralsTable).where(eq(referralsTable.referredUserId, req.userId!)).limit(1);
    if (existing[0]) return res.status(400).json({ error: "Already used a referral code" });

    await db.insert(referralsTable).values({ referrerId: referrer[0].id, referredUserId: req.userId!, coinsEarned: 50 });
    const me = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
    if (me[0]) {
      await db.update(usersTable).set({ coins: referrer[0].coins + 50 }).where(eq(usersTable.id, referrer[0].id));
      await db.update(usersTable).set({ coins: me[0].coins + 25 }).where(eq(usersTable.id, req.userId!));
    }

    return res.json({ success: true, coinsEarned: 25, message: "Referral applied! You received 25 coins." });
  } catch (err) {
    logger.error({ err }, "useReferralCode error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
