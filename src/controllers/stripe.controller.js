import stripe from "../utils/stripe.js";
import environments from "../config/dotenv.js";
import {
  getUserByClerkId,
  saveStripeAccountId,
} from "../services/user.service.js";
import prisma from "../config/db.js";

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

export async function crearCheckoutSession(req, res) {
  const clerkUserId = req.headers["x-clerk-user-id"];
  if (!clerkUserId) {
    return res.status(400).json({ error: "Falta x-clerk-user-id" });
  }

  const { eventId, items } = req.body;

  // Carga evento + creador + zonas
  const evento = await prisma.evento.findUnique({
    where: { id: eventId },
    include: { creador: true, zonasEvento: true },
  });
  if (!evento) return res.status(404).json({ error: "Evento no existe" });
  const destinationAcct = evento.creador.stripeAccountId;
  if (!destinationAcct) {
    return res.status(400).json({ error: "Creador sin cuenta Stripe" });
  }

  // Construye line_items
  const line_items = items.map(({ zonaId, cantidad }) => {
    const zona = evento.zonasEvento.find((z) => z.id === zonaId);
    if (!zona) throw new Error(`Zona ${zonaId} inválida`);
    return {
      price_data: {
        currency: "eur",
        product_data: { name: `${evento.titulo} — ${zona.nombre}` },
        unit_amount: Math.round(zona.precioBase * 100),
      },
      quantity: cantidad,
    };
  });

  // Crea la sesión Checkout
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    success_url: `${environments.app.url_front}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${environments.app.url_front}/events`,
    payment_intent_data: {
      transfer_data: { destination: destinationAcct },
    },
    metadata: {
      eventId: String(eventId),
      clerkUserId,
      items: JSON.stringify(items),
    },
  });

  res.json({ url: session.url });
}
