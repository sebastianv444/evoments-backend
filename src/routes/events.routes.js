import { Router } from "express";
import { searchEventsHandler, getFirstApprovedEventsHandler } from "../controllers/event.controller.js";

const router = Router();

router.get("/search", searchEventsHandler);
router.get("/top5", getFirstApprovedEventsHandler);

export default router;