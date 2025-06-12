import { syncUser } from "../models/user.model.js";
import { getCreatorByClerkId } from "../services/user.service.js";

export async function syncUserHandler(req, res) {
  try {
    console.log("Estoy en el cotrolador!");
    console.log(req.body);
    const { clerkId, email, firstName, lastName, phoneNumber, username } =
      req.body;

    const user = await syncUser({
      clerkId,
      firstName,
      lastName,
      email,
      phoneNumber,
      username,
    });
    res.status(200).json({ success: true, user });
  } catch (err) {
    return res.status(400).json({ error: true, msj: err });
  }
}

export async function obtenerRolHandler(req, res) {
  const clerkUserId = req.headers["x-clerk-user-id"];
  if (!clerkUserId)
    return res.status(400).json({ error: "Falta x-clerk-user-id" });
  try {
    const creador = await getCreatorByClerkId(clerkUserId);
    if (creador) {
      return res.json({
        isCreator: true,
        stripeAccountId: creador.stripeAccountId,
      });
    }
    return res.json({ isCreator: false, stripeAccountId: null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener rol" });
  }
}