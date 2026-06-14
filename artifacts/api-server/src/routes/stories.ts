import { Router } from "express";
import { db } from "@workspace/db";
import { storiesTable, userProgressTable } from "@workspace/db";
import { eq, sql, asc, count, inArray } from "drizzle-orm";
import { requireAuth, requireAdmin } from "../middlewares/requireAuth";
import { logger } from "../lib/logger";

const router = Router();

const DEFAULT_CHOICES = [
  { id: "a", text: "Proceed with caution", consequence: "You move forward carefully, staying alert." },
  { id: "b", text: "Rush ahead boldly", consequence: "You dash forward with determination." },
  { id: "c", text: "Take a different path", consequence: "You discover an unexpected route." },
];

router.get("/stories", requireAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const category = req.query.category as string | undefined;
    const offset = (page - 1) * limit;

    const baseQuery = db.select().from(storiesTable).where(eq(storiesTable.isPublished, true));
    const [totalRow] = await db.select({ count: count() }).from(storiesTable).where(eq(storiesTable.isPublished, true));
    const stories = await db.select().from(storiesTable)
      .where(eq(storiesTable.isPublished, true))
      .orderBy(asc(storiesTable.levelNumber))
      .limit(limit)
      .offset(offset);

    return res.json({
      stories,
      total: totalRow.count,
      page,
      totalPages: Math.ceil(totalRow.count / limit),
    });
  } catch (err) {
    logger.error({ err }, "listStories error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/stories", requireAdmin, async (req, res) => {
  try {
    const story = await db.insert(storiesTable).values(req.body).returning();
    return res.status(201).json(story[0]);
  } catch (err) {
    logger.error({ err }, "createStory error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/stories/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id));
    const story = await db.select().from(storiesTable).where(eq(storiesTable.id, id)).limit(1);
    if (!story[0]) return res.status(404).json({ error: "Not found" });
    return res.json(story[0]);
  } catch (err) {
    logger.error({ err }, "getStory error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/stories/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id));
    const updated = await db.update(storiesTable).set(req.body).where(eq(storiesTable.id, id)).returning();
    if (!updated[0]) return res.status(404).json({ error: "Not found" });
    return res.json(updated[0]);
  } catch (err) {
    logger.error({ err }, "updateStory error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/stories/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id));
    await db.delete(storiesTable).where(eq(storiesTable.id, id));
    return res.json({ success: true });
  } catch (err) {
    logger.error({ err }, "deleteStory error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/stories/:id/generate", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id));
    const story = await db.select().from(storiesTable).where(eq(storiesTable.id, id)).limit(1);
    if (!story[0]) return res.status(404).json({ error: "Not found" });

    const content = `You find yourself at the beginning of "${story[0].title}". The air is thick with mystery and the path ahead is uncertain. Ancient ruins loom in the distance as you take your first steps into this ${story[0].difficulty} adventure. Strange sounds echo through the trees, and you sense that your choices here will shape your destiny.`;

    const choices = [
      { id: "a", text: "Investigate the ruins", consequence: "You approach the ancient structure with curiosity." },
      { id: "b", text: "Follow the mysterious sounds", consequence: "You venture toward the unknown noises." },
      { id: "c", text: "Set up camp and observe", consequence: "You decide to study the area before acting." },
    ];

    await db.update(storiesTable).set({ storyContent: content, choices }).where(eq(storiesTable.id, id));

    return res.json({ storyId: id, content, choices });
  } catch (err) {
    logger.error({ err }, "generateStoryContent error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
