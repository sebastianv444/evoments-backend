import express from "express";
import { crearCuentaExpress } from "../controllers/stripe.controller.js";
import stripe from "../utils/stripe.js";
import { crearLoginLinkExpress } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.post("/crear-cuenta", crearCuentaExpress);
router.delete("/eliminarCuenta/:id", async (req, res) => {
  const deleted = await stripe.accounts.del(`${req.params.id}`);
  res.status(200).json({ res: deleted });
});
router.get("/login-link", crearLoginLinkExpress);

export default router;