import stripe from "../utils/stripe.js";
import { getCreatorByClerkId } from "../services/user.service.js";

export async function crearLoginLinkExpress(req, res) {
  const clerkUserId = req.headers["x-clerk-user-id"];
  if (!clerkUserId)
    return res.status(400).json({ error: "Falta x-clerk-user-id" });
  try {
    const creador = await getCreatorByClerkId(clerkUserId);
    if (!creador)
      return res.status(404).json({ error: "No tienes cuenta conectada" });

    const loginLink = await stripe.accounts.createLoginLink(
      creador.stripeAccountId,
      { redirect_url: `${process.env.FRONTEND_URL}/dashboard` }
    );
    res.json({ url: loginLink.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
