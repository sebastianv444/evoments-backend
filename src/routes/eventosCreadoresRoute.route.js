import { Router } from "express";
import * as controller from "../controllers/eventosCreadores.controller.js";

const router = Router();

router.post("/eventosDelCreador", controller.eventosDelPropioCreador);
router.post("/cambiarEventocreador", controller.cambiarEventocreador);



export default router;