import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, storiesTable, userProgressTable } from "@workspace/db";
import { eq, count, inArray } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import { logger } from "../lib/logger";
import { nanoid } from "nanoid";

const router = Router();

router.get("/gameplay/progress", requireAuth, async (req, res) => {
  try {
    const completed = await db.select({ storyId: userProgressTable.storyId }).from(userProgressTable).where(eq(userProgressTable.userId, req.userId!));
    const [totalRow] = await db.select({ count: count() }).from(storiesTable).where(eq(storiesTable.isPublished, true));
    const completedIds = completed.map(r => r.storyId);
    const currentLevel = (completedIds.length > 0 ? Math.max(...completedIds) + 1 : 1);
    return res.json({
      completedLevels: completedIds,
      currentLevel,
      totalLevels: totalRow.count,
      progressPercent: totalRow.count > 0 ? (completedIds.length / totalRow.count) * 100 : 0,
    });
  } catch (err) {
    logger.error({ err }, "getProgress error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/gameplay/levels/:storyId/start", requireAuth, async (req, res) => {
  try {
    const storyId = parseInt(String(req.params.storyId));
    const story = await db.select().from(storiesTable).where(eq(storiesTable.id, storyId)).limit(1);
    if (!story[0]) return res.status(404).json({ error: "Story not found" });

    const content = story[0].storyContent || `You have entered "${story[0].title}". The adventure begins now. Every choice you make will shape the outcome of this ${story[0].difficulty} tale. Proceed wisely.`;
    const choices = (story[0].choices as Array<{id: string; text: string; consequence: string}> | null) || [
      { id: "a", text: "Move forward", consequence: "You advance into the unknown." },
      { id: "b", text: "Look around first", consequence: "You survey your surroundings carefully." },
      { id: "c", text: "Call out to see if anyone is there", consequence: "Your voice echoes through the space." },
    ];

    return res.json({
      sessionId: nanoid(),
      storyId,
      startedAt: new Date().toISOString(),
      initialContent: content,
      choices,
    });
  } catch (err) {
    logger.error({ err }, "startLevel error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/gameplay/levels/:storyId/complete", requireAuth, async (req, res) => {
  try {
    const storyId = parseInt(String(req.params.storyId));
    const { score = 100 } = req.body;

    const story = await db.select().from(storiesTable).where(eq(storiesTable.id, storyId)).limit(1);
    if (!story[0]) return res.status(404).json({ error: "Story not found" });

    const alreadyCompleted = await db.select().from(userProgressTable)
      .where(eq(userProgressTable.userId, req.userId!))
      .limit(1000);
    const wasCompleted = alreadyCompleted.some(p => p.storyId === storyId);

    if (!wasCompleted) {
      await db.insert(userProgressTable).values({ userId: req.userId!, storyId, score });
    }

    const coinsEarned = wasCompleted ? 0 : story[0].coinsReward;
    const gemsEarned = wasCompleted ? 0 : story[0].gemsReward;
    const xpEarned = wasCompleted ? 0 : story[0].xpReward;

    const user = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
    if (!user[0]) return res.status(404).json({ error: "User not found" });

    const newXp = user[0].xp + xpEarned;
    const newLevel = Math.floor(newXp / 1000) + 1;
    const leveledUp = newLevel > user[0].level;

    await db.update(usersTable).set({
      coins: user[0].coins + coinsEarned,
      gems: user[0].gems + gemsEarned,
      xp: newXp,
      level: newLevel,
      totalLevelsCompleted: wasCompleted ? user[0].totalLevelsCompleted : user[0].totalLevelsCompleted + 1,
    }).where(eq(usersTable.id, req.userId!));

    return res.json({
      coinsEarned,
      gemsEarned,
      xpEarned,
      newLevel,
      leveledUp,
      newBadges: leveledUp ? [`Level ${newLevel} Achieved`] : [],
      newUserBalance: {
        coins: user[0].coins + coinsEarned,
        gems: user[0].gems + gemsEarned,
        xp: newXp,
        level: newLevel,
      },
    });
  } catch (err) {
    logger.error({ err }, "completeLevel error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/gameplay/choices", requireAuth, async (req, res) => {
  try {
    const { choiceId, storyId } = req.body;
    const story = await db.select().from(storiesTable).where(eq(storiesTable.id, storyId)).limit(1);
    const storyTitle = story[0]?.title || "your adventure";

    const continuations: Record<string, string> = {
      a: `Your decision to take the first path leads you deeper into the heart of ${storyTitle}. The consequences of your choice ripple through the narrative — hidden doors open, new allies emerge from the shadows, and the story takes an unexpected turn that only a bold adventurer could have anticipated.`,
      b: `Choosing the second option reveals a side of ${storyTitle} that few ever witness. Your careful consideration pays off as secrets unfold before you, and the path ahead becomes clearer — though not without its own dangers lurking in the distance.`,
      c: `The third path in ${storyTitle} is the road less traveled. Your unconventional choice surprises even the oldest inhabitants of this world, and they regard you with newfound respect as you forge your own way through this legendary tale.`,
    };

    const content = continuations[choiceId] || continuations["a"];
    const isEnding = Math.random() < 0.2;

    const choices = isEnding ? [] : [
      { id: "a", text: "Press on toward the goal", consequence: "You maintain your momentum." },
      { id: "b", text: "Seek allies before continuing", consequence: "You look for help along the way." },
      { id: "c", text: "Uncover the hidden truth", consequence: "You dig deeper into the mystery." },
    ];

    return res.json({ content, choices, isEnding });
  } catch (err) {
    logger.error({ err }, "makeChoice error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
