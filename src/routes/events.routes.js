import { Router } from "express";
import { searchEventsHandler } from "../controllers/event.controller.js";

const router = Router();

router.get("/search", searchEventsHandler);

export default router;