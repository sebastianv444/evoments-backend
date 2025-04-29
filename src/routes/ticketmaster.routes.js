import { Router } from "express";
import * as controller from "../controllers/ticketmaster.controller.js";
const router = Router();

router.get("/", controller.getEvents);

export default router;