import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const roleEnum = pgEnum("user_role", ["user", "moderator", "admin", "superadmin"]);

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkId: text("clerk_id").notNull().unique(),
  username: text("username").notNull(),
  email: text("email").notNull().unique(),
  avatarUrl: text("avatar_url"),
  coins: integer("coins").notNull().default(100),
  gems: integer("gems").notNull().default(10),
  level: integer("level").notNull().default(1),
  xp: integer("xp").notNull().default(0),
  role: roleEnum("role").notNull().default("user"),
  isPremium: boolean("is_premium").notNull().default(false),
  premiumExpiresAt: timestamp("premium_expires_at", { withTimezone: true }),
  isBanned: boolean("is_banned").notNull().default(false),
  banReason: text("ban_reason"),
  referralCode: text("referral_code").notNull().unique(),
  referredByUserId: integer("referred_by_user_id"),
  totalLevelsCompleted: integer("total_levels_completed").notNull().default(0),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  lastDailyRewardAt: timestamp("last_daily_reward_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
