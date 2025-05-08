import { Router } from "express";
import { clerkProtect } from "../middlewares/withClerk.js";
import * as controller from "../controllers/user.controller.js";
const router = Router();

router.post("/sync", clerkProtect, controller.syncUserHandler);
router.get("/prueba", (req, res) => res.status(200).json({ bien: true }));

export default router;
