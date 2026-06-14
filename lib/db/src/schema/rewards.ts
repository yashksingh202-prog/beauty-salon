import { pgTable, text, serial, integer, boolean, timestamp, pgEnum, json, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const rewardTypeEnum = pgEnum("reward_type", ["daily", "spin", "level_complete", "referral", "ad_watch", "event"]);
export const adTypeEnum = pgEnum("ad_type", ["rewarded", "interstitial", "banner"]);

export const rewardConfigsTable = pgTable("reward_configs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: rewardTypeEnum("type").notNull(),
  coins: integer("coins").notNull().default(0),
  gems: integer("gems").notNull().default(0),
  xp: integer("xp").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  config: json("config"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const spinPrizesTable = pgTable("spin_prizes", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  type: text("type").notNull().default("coins"),
  value: integer("value").notNull().default(0),
  probability: numeric("probability", { precision: 5, scale: 4 }).notNull().default("0.1"),
  color: text("color").notNull().default("#7c3aed"),
  isActive: boolean("is_active").notNull().default(true),
});

export const adConfigsTable = pgTable("ad_configs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: adTypeEnum("type").notNull(),
  coinsReward: integer("coins_reward").notNull().default(10),
  gemsReward: integer("gems_reward").notNull().default(0),
  dailyLimit: integer("daily_limit").notNull().default(5),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const adWatchLogsTable = pgTable("ad_watch_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  adConfigId: integer("ad_config_id").notNull(),
  watchedAt: timestamp("watched_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertRewardConfigSchema = createInsertSchema(rewardConfigsTable).omit({ id: true, createdAt: true });
export type InsertRewardConfig = z.infer<typeof insertRewardConfigSchema>;
export type RewardConfig = typeof rewardConfigsTable.$inferSelect;
export type SpinPrize = typeof spinPrizesTable.$inferSelect;
export type AdConfig = typeof adConfigsTable.$inferSelect;
