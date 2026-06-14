import { Router, type IRouter } from "express";
import healthRouter from "./health";
import usersRouter from "./users";
import storiesRouter from "./stories";
import gameplayRouter from "./gameplay";
import rewardsRouter from "./rewards";
import leaderboardRouter from "./leaderboard";
import referralsRouter from "./referrals";
import premiumRouter from "./premium";
import inventoryRouter from "./inventory";
import bossesRouter from "./bosses";
import eventsRouter from "./events";
import withdrawalsRouter from "./withdrawals";
import adminRouter from "./admin";
import analyticsRouter from "./analytics";

const router: IRouter = Router();

router.use(healthRouter);
router.use(usersRouter);
router.use(storiesRouter);
router.use(gameplayRouter);
router.use(rewardsRouter);
router.use(leaderboardRouter);
router.use(referralsRouter);
router.use(premiumRouter);
router.use(inventoryRouter);
router.use(bossesRouter);
router.use(eventsRouter);
router.use(withdrawalsRouter);
router.use(adminRouter);
router.use(analyticsRouter);

export default router;
