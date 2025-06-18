import { Router } from "express";
import authCreator from "../middlewares/authCreator.js";
import { scanEntradaHandler } from "../controllers/entrada.controller.js";

const router = Router();
router.post("/scan/:token", authCreator, scanEntradaHandler);
export default router;