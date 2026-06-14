import { Router } from "express";
import { db } from "@workspace/db";
import { gameEventsTable, eventParticipantsTable } from "@workspace/db";
import { eq, and, count } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import { logger } from "../lib/logger";

const router = Router();

router.get("/events", requireAuth, async (req, res) => {
  try {
    const events = await db.select().from(gameEventsTable).where(eq(gameEventsTable.status, "active"));
    const result = [];
    for (const event of events) {
      const [participantCount] = await db.select({ count: count() }).from(eventParticipantsTable).where(eq(eventParticipantsTable.eventId, event.id));
      const myParticipation = await db.select().from(eventParticipantsTable)
        .where(and(eq(eventParticipantsTable.eventId, event.id), eq(eventParticipantsTable.userId, req.userId!)))
        .limit(1);
      result.push({ ...event, startAt: event.startAt.toISOString(), endAt: event.endAt.toISOString(), participantCount: participantCount.count, isParticipating: myParticipation.length > 0 });
    }
    return res.json(result);
  } catch (err) {
    logger.error({ err }, "listEvents error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/events/:id/join", requireAuth, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id));
    const event = await db.select().from(gameEventsTable).where(eq(gameEventsTable.id, id)).limit(1);
    if (!event[0]) return res.status(404).json({ error: "Event not found" });

    const existing = await db.select().from(eventParticipantsTable)
      .where(and(eq(eventParticipantsTable.eventId, id), eq(eventParticipantsTable.userId, req.userId!)))
      .limit(1);
    if (existing[0]) return res.status(400).json({ error: "Already participating" });

    await db.insert(eventParticipantsTable).values({ eventId: id, userId: req.userId! });
    return res.json({ eventId: id, joinedAt: new Date().toISOString(), status: "joined" });
  } catch (err) {
    logger.error({ err }, "joinEvent error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
