import { Router } from "express";
import { db } from "@workspace/db";
import { withdrawalsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import { logger } from "../lib/logger";

const router = Router();

router.get("/withdrawals", requireAuth, async (req, res) => {
  try {
    const withdrawals = await db.select().from(withdrawalsTable)
      .where(eq(withdrawalsTable.userId, req.userId!))
      .orderBy(desc(withdrawalsTable.createdAt));
    return res.json(withdrawals.map(w => ({
      ...w,
      amount: parseFloat(String(w.amount)),
      createdAt: w.createdAt.toISOString(),
      processedAt: w.processedAt?.toISOString() || null,
    })));
  } catch (err) {
    logger.error({ err }, "listMyWithdrawals error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/withdrawals", requireAuth, async (req, res) => {
  try {
    const { amount, currency, method, accountDetails } = req.body;
    const newWithdrawal = await db.insert(withdrawalsTable).values({
      userId: req.userId!,
      amount: String(amount),
      currency: currency || "USD",
      method,
      accountDetails,
    }).returning();
    const w = newWithdrawal[0];
    return res.status(201).json({ ...w, amount: parseFloat(String(w.amount)), createdAt: w.createdAt.toISOString(), processedAt: null });
  } catch (err) {
    logger.error({ err }, "createWithdrawal error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
