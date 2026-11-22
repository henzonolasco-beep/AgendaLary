import { Router, type IRouter } from "express";
import authRouter from "./auth";
import healthRouter from "./health";
import schoolRouter from "./school";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(schoolRouter);

export default router;
