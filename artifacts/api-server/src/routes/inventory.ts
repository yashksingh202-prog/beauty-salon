import { Router } from "express";
import { db } from "@workspace/db";
import { itemsTable, userInventoryTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import { logger } from "../lib/logger";

const router = Router();

router.get("/inventory", requireAuth, async (req, res) => {
  try {
    const userItems = await db.select({
      id: userInventoryTable.id,
      itemId: userInventoryTable.itemId,
      isEquipped: userInventoryTable.isEquipped,
      acquiredAt: userInventoryTable.acquiredAt,
      name: itemsTable.name,
      description: itemsTable.description,
      type: itemsTable.type,
      imageUrl: itemsTable.imageUrl,
    }).from(userInventoryTable)
      .innerJoin(itemsTable, eq(userInventoryTable.itemId, itemsTable.id))
      .where(eq(userInventoryTable.userId, req.userId!));

    const items = userItems.map(i => ({
      id: i.id,
      name: i.name,
      description: i.description,
      type: i.type,
      imageUrl: i.imageUrl,
      isEquipped: i.isEquipped,
      acquiredAt: i.acquiredAt.toISOString(),
    }));

    return res.json({ items, equippedItemIds: items.filter(i => i.isEquipped).map(i => i.id) });
  } catch (err) {
    logger.error({ err }, "getInventory error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/inventory/:itemId/equip", requireAuth, async (req, res) => {
  try {
    const itemId = parseInt(String(req.params.itemId));
    const updated = await db.update(userInventoryTable)
      .set({ isEquipped: true })
      .where(eq(userInventoryTable.id, itemId))
      .returning();
    if (!updated[0]) return res.status(404).json({ error: "Item not found" });

    const item = await db.select().from(itemsTable).where(eq(itemsTable.id, updated[0].itemId)).limit(1);
    return res.json({ ...item[0], isEquipped: true, acquiredAt: updated[0].acquiredAt.toISOString() });
  } catch (err) {
    logger.error({ err }, "equipItem error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
