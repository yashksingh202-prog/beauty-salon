import { pgTable, text, serial, integer, boolean, timestamp, pgEnum, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const difficultyEnum = pgEnum("story_difficulty", ["easy", "medium", "hard", "legendary"]);

export const storiesTable = pgTable("stories", {
  id: serial("id").primaryKey(),
  levelNumber: integer("level_number").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull().default("adventure"),
  difficulty: difficultyEnum("difficulty").notNull().default("easy"),
  coinsReward: integer("coins_reward").notNull().default(50),
  gemsReward: integer("gems_reward").notNull().default(2),
  xpReward: integer("xp_reward").notNull().default(100),
  isPremium: boolean("is_premium").notNull().default(false),
  isPublished: boolean("is_published").notNull().default(true),
  thumbnailUrl: text("thumbnail_url"),
  estimatedMinutes: integer("estimated_minutes").notNull().default(5),
  storyContent: text("story_content"),
  choices: json("choices"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const userProgressTable = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  storyId: integer("story_id").notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }).notNull().defaultNow(),
  score: integer("score").notNull().default(0),
  timeTaken: integer("time_taken"),
});

export const insertStorySchema = createInsertSchema(storiesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertStory = z.infer<typeof insertStorySchema>;
export type Story = typeof storiesTable.$inferSelect;
export type UserProgress = typeof userProgressTable.$inferSelect;
