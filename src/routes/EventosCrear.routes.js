import { Router } from "express";
import * as controller from "../controllers/crearEvento.controller.js";
const router = Router();

router.post("/eventos", controller.crearEvento);



export default router;