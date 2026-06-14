import { pgTable, text, serial, integer, boolean, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const premiumPlansTable = pgTable("premium_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: numeric("price", { precision: 8, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  durationDays: integer("duration_days").notNull().default(30),
  gemsBonus: integer("gems_bonus").notNull().default(50),
  coinsBonus: integer("coins_bonus").notNull().default(500),
  features: text("features").array().notNull().default([]),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const premiumSubscriptionsTable = pgTable("premium_subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  planId: integer("plan_id").notNull(),
  startAt: timestamp("start_at", { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertPremiumPlanSchema = createInsertSchema(premiumPlansTable).omit({ id: true, createdAt: true });
export type InsertPremiumPlan = z.infer<typeof insertPremiumPlanSchema>;
export type PremiumPlan = typeof premiumPlansTable.$inferSelect;
export type PremiumSubscription = typeof premiumSubscriptionsTable.$inferSelect;
