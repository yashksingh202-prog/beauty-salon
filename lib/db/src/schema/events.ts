import { pgTable, text, serial, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const eventTypeEnum = pgEnum("event_type", ["story", "battle", "challenge", "seasonal"]);
export const eventStatusEnum = pgEnum("event_status", ["upcoming", "active", "ended"]);

export const gameEventsTable = pgTable("game_events", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  type: eventTypeEnum("type").notNull(),
  status: eventStatusEnum("status").notNull().default("upcoming"),
  startAt: timestamp("start_at", { withTimezone: true }).notNull(),
  endAt: timestamp("end_at", { withTimezone: true }).notNull(),
  coinsReward: integer("coins_reward").notNull().default(100),
  gemsReward: integer("gems_reward").notNull().default(5),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const eventParticipantsTable = pgTable("event_participants", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  userId: integer("user_id").notNull(),
  joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
  status: text("status").notNull().default("joined"),
});

export const insertGameEventSchema = createInsertSchema(gameEventsTable).omit({ id: true, createdAt: true });
export type InsertGameEvent = z.infer<typeof insertGameEventSchema>;
export type GameEvent = typeof gameEventsTable.$inferSelect;
export type EventParticipant = typeof eventParticipantsTable.$inferSelect;
