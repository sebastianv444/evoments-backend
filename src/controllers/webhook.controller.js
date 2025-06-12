import stripe from "../utils/stripe.js";
import {
  getUserByStripeAccountId,
  promoteToCreator,
} from "../services/user.service.js";
import environments from "../config/dotenv.js";

export async function handleWebhook(req, res) {
  try {
    const sig = req.headers["stripe-signature"];
    const buf = req.body; // Buffer puro gracias a express.raw({ type: "*/*" })

    // Validar la firma
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        buf,
        sig,
        environments.stripe.webhookKey
      );
    } catch (err) {
      console.error("🔴 Error de firma de webhook:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const eventType = event.type;
    console.log(`🔔 Evento recibido: ${eventType}`);

    if (eventType === "account.updated" || eventType === "capability.updated") {
      let accountObj = null;

      if (eventType === "account.updated") {
        accountObj = event.data.object;
      } else {
        // En capability.updated, event.data.object es Capability
        const capability = event.data.object;
        const accountId = capability.account;
        try {
          accountObj = await stripe.accounts.retrieve(accountId);
        } catch (err) {
          console.error(
            `🔴 No pude recuperar la cuenta ${capability.account}:`,
            err
          );
          return res.status(500).json({ error: "Error al obtener Account" });
        }
      }

      if (!accountObj) {
        console.warn("⚠️ accountObj es null o indefinido.");
        return res.status(200).json({ received: true });
      }

      const {
        id: accountId,
        charges_enabled,
        payouts_enabled,
        details_submitted,
      } = accountObj;

      console.log(
        `ℹ️ Flags de la cuenta ${accountId}: charges_enabled=${charges_enabled}, payouts_enabled=${payouts_enabled}, details_submitted=${details_submitted}`
      );

      // ─────────────────────────────────────────────────────────────────
      //   Aquí está la “magia”:
      //   Si estamos en desarrollo (NODE_ENV !== 'production'), promovemos
      //   sin fijarnos en las tres banderas. En producción sí las chequeamos.
      const isDev = process.env.NODE_ENV !== "production";

      if (
        isDev ||
        (charges_enabled === true &&
          payouts_enabled === true &&
          details_submitted === true)
      ) {
        // Buscamos al usuario por stripeAccountId
        const usuario = await getUserByStripeAccountId(accountId);
        if (!usuario) {
          console.warn(
            `⚠️ Usuario no encontrado para stripeAccountId: ${accountId}`
          );
        } else {
          await promoteToCreator(usuario);
          console.log(
            `✅ Usuario ${usuario.clerkUserId} promovido a Creador con stripeAccountId ${accountId}`
          );
        }
      } else {
        console.log(
          `ℹ️ Cuenta Connect ${accountId} aún no completada. No se promueve.`
        );
      }
      // ─────────────────────────────────────────────────────────────────
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("❌ Error general en handleWebhook:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}