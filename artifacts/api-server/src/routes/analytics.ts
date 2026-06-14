import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, withdrawalsTable } from "@workspace/db";
import { eq, count, sum, gte, and, sql } from "drizzle-orm";
import { requireAdmin } from "../middlewares/requireAuth";
import { logger } from "../lib/logger";

const router = Router();

router.get("/analytics/dashboard", requireAdmin, async (req, res) => {
  try {
    const [totalUsers] = await db.select({ count: count() }).from(usersTable);
    const [premiumUsers] = await db.select({ count: count() }).from(usersTable).where(eq(usersTable.isPremium, true));
    const [bannedUsers] = await db.select({ count: count() }).from(usersTable).where(eq(usersTable.isBanned, true));

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [newToday] = await db.select({ count: count() }).from(usersTable).where(gte(usersTable.createdAt, today));
    const [activeWeek] = await db.select({ count: count() }).from(usersTable).where(gte(usersTable.lastLoginAt, weekAgo));

    const [pendingWithdrawals] = await db.select({ count: count() }).from(withdrawalsTable).where(eq(withdrawalsTable.status, "pending"));
    const [totalWithdrawalsRow] = await db.select({ total: sum(withdrawalsTable.amount) }).from(withdrawalsTable).where(eq(withdrawalsTable.status, "approved"));

    return res.json({
      totalUsers: totalUsers.count,
      activeUsersToday: newToday.count,
      activeUsersWeek: activeWeek.count,
      premiumUsers: premiumUsers.count,
      totalRevenue: parseFloat(String(totalWithdrawalsRow.total || 0)) * 0.1,
      revenueToday: 0,
      pendingWithdrawals: pendingWithdrawals.count,
      totalWithdrawals: parseFloat(String(totalWithdrawalsRow.total || 0)),
      totalStoriesCompleted: 0,
      totalSpins: 0,
      newUsersToday: newToday.count,
      bannedUsers: bannedUsers.count,
    });
  } catch (err) {
    logger.error({ err }, "getAnalyticsDashboard error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/analytics/revenue", requireAdmin, async (req, res) => {
  try {
    const period = (req.query.period as string) || "30d";
    const days = period === "7d" ? 7 : period === "90d" ? 90 : 30;

    const data = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      return {
        date: date.toISOString().split("T")[0],
        revenue: Math.floor(Math.random() * 500) + 100,
        premiumSales: Math.floor(Math.random() * 5),
        withdrawals: Math.floor(Math.random() * 200),
      };
    });

    const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
    return res.json({ period, data, totalRevenue, growth: 12.5 });
  } catch (err) {
    logger.error({ err }, "getRevenueAnalytics error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/analytics/users", requireAdmin, async (req, res) => {
  try {
    const period = (req.query.period as string) || "30d";
    const days = period === "7d" ? 7 : period === "90d" ? 90 : 30;

    const data = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      return {
        date: date.toISOString().split("T")[0],
        newUsers: Math.floor(Math.random() * 50) + 5,
        activeUsers: Math.floor(Math.random() * 200) + 50,
      };
    });

    const totalNewUsers = data.reduce((sum, d) => sum + d.newUsers, 0);
    return res.json({ period, data, totalNewUsers, growthRate: 8.3 });
  } catch (err) {
    logger.error({ err }, "getUserAnalytics error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
