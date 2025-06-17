import { Router } from "express";
import * as controller from "../controllers/adminEventsPendientes.controller.js";

const router = Router();

router.get("/eventos-pendientes", controller.eventospendientes);
router.post("/eventos/actualizarEstadoEvento", controller.actualizarEstadoEvento);


export default router;