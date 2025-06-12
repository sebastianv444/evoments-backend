import stripe from "../utils/stripe.js";
import environments from "../config/dotenv.js";
import {
  getUserByClerkId,
  saveStripeAccountId,
} from "../services/user.service.js";

export async function crearCuentaExpress(req, res) {
  try {
    const { clerkUserId } = req.body;
    const usuario = await getUserByClerkId(clerkUserId);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    let accountId = usuario.stripeAccountId;
    // Si aún no tiene stripeAccountId, creamos la cuenta Connect Express
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        email: usuario.email,
      });
      accountId = account.id;
      // Guardamos ese ID en la tabla Cliente
      await saveStripeAccountId(clerkUserId, accountId);
    }

    // Creamos el link de Onboarding (accountLinks)
    const origin = req.headers.origin || environments.app.url_front;
    const link = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${origin}/creador?error=stripe_failed`,
      return_url: `${origin}/creador?success=stripe_ok`,
      type: "account_onboarding",
    });

    res.json({ url: link.url });
  } catch (err) {
    console.error("Error en crearCuentaExpress:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
