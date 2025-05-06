import { Router } from "express";
import withClerk from "../middlewares/withClerk.js";
import * as controller from "../controllers/user.controller.js";
const router = Router();

router.post("/sync", withClerk, controller.syncUserHandler);

export default router;