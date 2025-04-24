import { Router } from "express";
import { index } from "../controllers/ticketmaster.controller.js";
const router = Router();

router.get("/:id", index);

export default router;
