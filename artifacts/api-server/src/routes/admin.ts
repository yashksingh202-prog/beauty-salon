import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, storiesTable, withdrawalsTable, rewardConfigsTable, adConfigsTable, gameEventsTable, premiumPlansTable, premiumSubscriptionsTable } from "@workspace/db";
import { eq, like, and, or, count, sum, desc, sql } from "drizzle-orm";
import { requireAdmin } from "../middlewares/requireAuth";
import { logger } from "../lib/logger";

const router = Router();

// ── USERS ──────────────────────────────────────────────────────────────────
router.get("/admin/users", requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string | undefined;
    const status = req.query.status as string | undefined;
    const offset = (page - 1) * limit;

    let conditions: any[] = [];
    if (search) conditions.push(or(like(usersTable.username, `%${search}%`), like(usersTable.email, `%${search}%`)));
    if (status === "banned") conditions.push(eq(usersTable.isBanned, true));
    if (status === "premium") conditions.push(eq(usersTable.isPremium, true));
    if (status === "active") conditions.push(eq(usersTable.isBanned, false));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [totalRow] = await db.select({ count: count() }).from(usersTable).where(whereClause);
    const users = await db.select().from(usersTable).where(whereClause).orderBy(desc(usersTable.createdAt)).limit(limit).offset(offset);

    return res.json({
      users: users.map(u => ({ ...u, lastLoginAt: u.lastLoginAt?.toISOString() || null, createdAt: u.createdAt.toISOString() })),
      total: totalRow.count,
      page,
      totalPages: Math.ceil(totalRow.count / limit),
    });
  } catch (err) {
    logger.error({ err }, "adminListUsers error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/users/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id));
    const user = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);
    if (!user[0]) return res.status(404).json({ error: "Not found" });
    return res.json({ ...user[0], lastLoginAt: user[0].lastLoginAt?.toISOString() || null, createdAt: user[0].createdAt.toISOString() });
  } catch (err) {
    logger.error({ err }, "adminGetUser error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/users/:id/ban", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id));
    const { reason } = req.body;
    const updated = await db.update(usersTable).set({ isBanned: true, banReason: reason }).where(eq(usersTable.id, id)).returning();
    if (!updated[0]) return res.status(404).json({ error: "Not found" });
    return res.json({ ...updated[0], lastLoginAt: updated[0].lastLoginAt?.toISOString() || null, createdAt: updated[0].createdAt.toISOString() });
  } catch (err) {
    logger.error({ err }, "adminBanUser error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/users/:id/unban", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id));
    const updated = await db.update(usersTable).set({ isBanned: false, banReason: null }).where(eq(usersTable.id, id)).returning();
    if (!updated[0]) return res.status(404).json({ error: "Not found" });
    return res.json({ ...updated[0], lastLoginAt: updated[0].lastLoginAt?.toISOString() || null, createdAt: updated[0].createdAt.toISOString() });
  } catch (err) {
    logger.error({ err }, "adminUnbanUser error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/users/:id/adjust-balance", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id));
    const { coins, gems } = req.body;
    const user = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);
    if (!user[0]) return res.status(404).json({ error: "Not found" });
    const newCoins = coins !== undefined ? user[0].coins + coins : user[0].coins;
    const newGems = gems !== undefined ? user[0].gems + gems : user[0].gems;
    const updated = await db.update(usersTable).set({ coins: newCoins, gems: newGems }).where(eq(usersTable.id, id)).returning();
    return res.json({ ...updated[0], lastLoginAt: updated[0].lastLoginAt?.toISOString() || null, createdAt: updated[0].createdAt.toISOString() });
  } catch (err) {
    logger.error({ err }, "adminAdjustBalance error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ── WITHDRAWALS ────────────────────────────────────────────────────────────
router.get("/admin/withdrawals", requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string | undefined;
    const offset = (page - 1) * limit;

    const where = status ? eq(withdrawalsTable.status, status as "pending" | "approved" | "rejected") : undefined;
    const [totalRow] = await db.select({ count: count() }).from(withdrawalsTable).where(where);
    const withdrawals = await db.select().from(withdrawalsTable).where(where).orderBy(desc(withdrawalsTable.createdAt)).limit(limit).offset(offset);

    return res.json({
      withdrawals: withdrawals.map(w => ({ ...w, amount: parseFloat(String(w.amount)), createdAt: w.createdAt.toISOString(), processedAt: w.processedAt?.toISOString() || null })),
      total: totalRow.count,
      page,
      totalPages: Math.ceil(totalRow.count / limit),
    });
  } catch (err) {
    logger.error({ err }, "adminListWithdrawals error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/withdrawals/:id/approve", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id));
    const updated = await db.update(withdrawalsTable).set({ status: "approved", processedAt: new Date() }).where(eq(withdrawalsTable.id, id)).returning();
    if (!updated[0]) return res.status(404).json({ error: "Not found" });
    const w = updated[0];
    return res.json({ ...w, amount: parseFloat(String(w.amount)), createdAt: w.createdAt.toISOString(), processedAt: w.processedAt?.toISOString() || null });
  } catch (err) {
    logger.error({ err }, "adminApproveWithdrawal error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/withdrawals/:id/reject", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id));
    const { reason } = req.body;
    const updated = await db.update(withdrawalsTable).set({ status: "rejected", adminNote: reason, processedAt: new Date() }).where(eq(withdrawalsTable.id, id)).returning();
    if (!updated[0]) return res.status(404).json({ error: "Not found" });
    const w = updated[0];
    return res.json({ ...w, amount: parseFloat(String(w.amount)), createdAt: w.createdAt.toISOString(), processedAt: w.processedAt?.toISOString() || null });
  } catch (err) {
    logger.error({ err }, "adminRejectWithdrawal error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ── REWARDS ────────────────────────────────────────────────────────────────
router.get("/admin/rewards", requireAdmin, async (req, res) => {
  try {
    const rewards = await db.select().from(rewardConfigsTable).orderBy(desc(rewardConfigsTable.createdAt));
    return res.json(rewards);
  } catch (err) {
    logger.error({ err }, "adminListRewards error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/rewards", requireAdmin, async (req, res) => {
  try {
    const reward = await db.insert(rewardConfigsTable).values(req.body).returning();
    return res.status(201).json(reward[0]);
  } catch (err) {
    logger.error({ err }, "adminCreateReward error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/admin/rewards/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id));
    const updated = await db.update(rewardConfigsTable).set(req.body).where(eq(rewardConfigsTable.id, id)).returning();
    if (!updated[0]) return res.status(404).json({ error: "Not found" });
    return res.json(updated[0]);
  } catch (err) {
    logger.error({ err }, "adminUpdateReward error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/admin/rewards/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id));
    await db.delete(rewardConfigsTable).where(eq(rewardConfigsTable.id, id));
    return res.json({ success: true });
  } catch (err) {
    logger.error({ err }, "adminDeleteReward error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ── ADS ────────────────────────────────────────────────────────────────────
router.get("/admin/ads", requireAdmin, async (req, res) => {
  try {
    const ads = await db.select().from(adConfigsTable).orderBy(desc(adConfigsTable.createdAt));
    return res.json(ads.map(a => ({ ...a, createdAt: a.createdAt.toISOString() })));
  } catch (err) {
    logger.error({ err }, "adminListAds error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/ads", requireAdmin, async (req, res) => {
  try {
    const ad = await db.insert(adConfigsTable).values(req.body).returning();
    return res.status(201).json({ ...ad[0], createdAt: ad[0].createdAt.toISOString() });
  } catch (err) {
    logger.error({ err }, "adminCreateAd error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/admin/ads/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id));
    const updated = await db.update(adConfigsTable).set(req.body).where(eq(adConfigsTable.id, id)).returning();
    if (!updated[0]) return res.status(404).json({ error: "Not found" });
    return res.json({ ...updated[0], createdAt: updated[0].createdAt.toISOString() });
  } catch (err) {
    logger.error({ err }, "adminUpdateAd error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ── EVENTS ─────────────────────────────────────────────────────────────────
router.get("/admin/events", requireAdmin, async (req, res) => {
  try {
    const events = await db.select().from(gameEventsTable).orderBy(desc(gameEventsTable.createdAt));
    return res.json(events.map(e => ({ ...e, startAt: e.startAt.toISOString(), endAt: e.endAt.toISOString(), participantCount: 0, isParticipating: false })));
  } catch (err) {
    logger.error({ err }, "adminListEvents error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/events", requireAdmin, async (req, res) => {
  try {
    const event = await db.insert(gameEventsTable).values({ ...req.body, startAt: new Date(req.body.startAt), endAt: new Date(req.body.endAt) }).returning();
    const e = event[0];
    return res.status(201).json({ ...e, startAt: e.startAt.toISOString(), endAt: e.endAt.toISOString(), participantCount: 0, isParticipating: false });
  } catch (err) {
    logger.error({ err }, "adminCreateEvent error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
