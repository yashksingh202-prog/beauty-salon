import { getAuth } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userRole?: string;
      clerkUserId?: string;
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const auth = getAuth(req);
  const clerkUserId = auth?.userId;
  if (!clerkUserId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const user = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkUserId)).limit(1);
  if (!user[0]) {
    res.status(401).json({ error: "User not found. Please sync your account." });
    return;
  }
  if (user[0].isBanned) {
    res.status(403).json({ error: "Account banned", reason: user[0].banReason });
    return;
  }
  req.userId = user[0].id;
  req.userRole = user[0].role;
  req.clerkUserId = clerkUserId;
  next();
};

export const requireAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  await requireAuth(req, res, () => {
    if (!req.userRole || !["admin", "superadmin"].includes(req.userRole)) {
      res.status(403).json({ error: "Admin access required" });
      return;
    }
    next();
  });
};
