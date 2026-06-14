import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const bossDifficultyEnum = pgEnum("boss_difficulty", ["normal", "hard", "extreme", "legendary"]);

export const bossesTable = pgTable("bosses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  difficulty: bossDifficultyEnum("difficulty").notNull().default("normal"),
  hp: integer("hp").notNull().default(1000),
  coinsReward: integer("coins_reward").notNull().default(200),
  gemsReward: integer("gems_reward").notNull().default(10),
  xpReward: integer("xp_reward").notNull().default(500),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").notNull().default(true),
  cooldownHours: integer("cooldown_hours").notNull().default(24),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const bossBattleLogsTable = pgTable("boss_battle_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  bossId: integer("boss_id").notNull(),
  won: boolean("won").notNull().default(false),
  damageDealt: integer("damage_dealt").notNull().default(0),
  coinsEarned: integer("coins_earned").notNull().default(0),
  gemsEarned: integer("gems_earned").notNull().default(0),
  xpEarned: integer("xp_earned").notNull().default(0),
  battleAt: timestamp("battle_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertBossSchema = createInsertSchema(bossesTable).omit({ id: true, createdAt: true });
export type InsertBoss = z.infer<typeof insertBossSchema>;
export type Boss = typeof bossesTable.$inferSelect;
export type BossBattleLog = typeof bossBattleLogsTable.$inferSelect;
