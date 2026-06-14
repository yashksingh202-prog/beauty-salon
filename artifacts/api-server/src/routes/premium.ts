import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, premiumPlansTable, premiumSubscriptionsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import { logger } from "../lib/logger";

const router = Router();

router.get("/premium/status", requireAuth, async (req, res) => {
  try {
    const user = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
    if (!user[0]) return res.status(404).json({ error: "Not found" });

    if (!user[0].isPremium) {
      return res.json({ isPremium: false, planId: null, planName: null, expiresAt: null, features: [] });
    }

    const sub = await db.select().from(premiumSubscriptionsTable)
      .where(eq(premiumSubscriptionsTable.userId, req.userId!))
      .orderBy(desc(premiumSubscriptionsTable.createdAt))
      .limit(1);

    let planName = "Premium";
    if (sub[0]) {
      const plan = await db.select().from(premiumPlansTable).where(eq(premiumPlansTable.id, sub[0].planId)).limit(1);
      if (plan[0]) planName = plan[0].name;
    }

    return res.json({
      isPremium: true,
      planId: sub[0]?.planId || null,
      planName,
      expiresAt: user[0].premiumExpiresAt?.toISOString() || null,
      features: ["Unlimited stories", "2x coin rewards", "Exclusive boss battles", "Ad-free experience", "Priority support"],
    });
  } catch (err) {
    logger.error({ err }, "getPremiumStatus error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/premium/plans", requireAuth, async (req, res) => {
  try {
    const plans = await db.select().from(premiumPlansTable).where(eq(premiumPlansTable.isActive, true));
    return res.json(plans.map(p => ({
      ...p,
      price: parseFloat(String(p.price)),
      features: p.features || [],
    })));
  } catch (err) {
    logger.error({ err }, "getPremiumPlans error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
