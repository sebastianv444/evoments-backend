import stripe from "../utils/stripe.js";
import {
  getUserByStripeAccountId,
  promoteToCreator,
} from "../services/user.service.js";
import environments from "../config/dotenv.js";
import prisma from "../config/db.js";
import QRCode from "qrcode";
import { Resend } from "resend";
import { v4 as uuidv4 } from "uuid";

// Inicializa Resend
const resend = new Resend(environments.resend.apiKey);

export async function handleWebhook(req, res) {
  try {
    // 0) Leer raw body y validar firma
    const sig = req.headers["stripe-signature"];
    const buf = req.body;
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
    console.log(`🔔 Evento recibido: ${event.type}`);

    // 1) Promover a creador si toca
    if (["account.updated", "capability.updated"].includes(event.type)) {
      let accountObj = event.data.object;
      if (event.type === "capability.updated") {
        accountObj = await stripe.accounts.retrieve(accountObj.account);
      }
      const {
        id: accountId,
        charges_enabled,
        payouts_enabled,
        details_submitted,
      } = accountObj;
      const isDev = process.env.NODE_ENV !== "production";
      if (isDev || (charges_enabled && payouts_enabled && details_submitted)) {
        const user = await getUserByStripeAccountId(accountId);
        if (user) {
          await promoteToCreator(user);
          console.log(`✅ Usuario ${user.clerkUserId} promovido a creador`);
        }
      }
    }

    // 2) Manejar checkout.session.completed
    if (event.type === "checkout.session.completed") {
      const sess = event.data.object;
      const { eventId, clerkUserId, items } = sess.metadata;
      const parsedItems = JSON.parse(items);

      // 2.1) Verificar que el evento existe
      const evento = await prisma.evento.findUnique({
        where: { id: Number(eventId) },
      });
      if (!evento) throw new Error("Evento no encontrado");

      // 2.2) Asegurar registro en Cliente (o crearlo desde Creador)
      let cliente = await prisma.cliente.findUnique({ where: { clerkUserId } });
      if (!cliente) {
        const creador = await prisma.creador.findUnique({
          where: { clerkUserId },
        });
        if (!creador) throw new Error("Usuario no es Cliente ni Creador");
        cliente = await prisma.cliente.create({
          data: {
            clerkUserId: creador.clerkUserId,
            nombre: creador.nombre,
            apellidos: creador.apellidos,
            email: creador.email,
            telefono: creador.telefono,
          },
        });
      }

      // 2.3) Preparar lista de correos
      const emailsToSend = [];

      // 2.4) Transacción: crear Entradas y Pagos
      await prisma.$transaction(async (tx) => {
        for (const { zonaId, cantidad } of parsedItems) {
          // 2.4.1) Recuperar precio de la zona
          const zona = await tx.zonaEvento.findUnique({
            where: { id: zonaId },
          });
          if (!zona) throw new Error(`Zona ${zonaId} no encontrada`);

          for (let i = 0; i < cantidad; i++) {
            const token = uuidv4();

            // 2.4.2) Crear Entrada (solo campos escalares)
            console.log("Creando entrada con data:", {
              eventoId: evento.id,
              clienteId: cliente.id,
              zonaId: zona.id,
              qrToken: token,
            });
            const entrada = await tx.entrada.create({
              data: {
                eventoId: evento.id,
                clienteId: cliente.id,
                zonaId: zona.id,
                qrToken: token,
              },
            });

            // 2.4.3) Crear Pago
            await tx.pago.create({
              data: {
                entradaId: entrada.id,
                stripePaymentIntentId: sess.payment_intent,
                amount: Number(zona.precioBase),
                currency: sess.currency.toUpperCase(),
              },
            });

            // 2.4.4) Preparar datos para correo
            const scanUrl = `${process.env.API_URL}/api/entradas/scan/${token}`;
            const qrImage = await QRCode.toDataURL(scanUrl);
            emailsToSend.push({
              to: cliente.email,
              title: evento.titulo,
              qrImage,
            });

            // 2.4.5) Marcar QR como enviado
            await tx.entrada.update({
              where: { id: entrada.id },
              data: { qrEnviado: true },
            });
          }
        }
      });

      // 2.5) Enviar correos fuera de la transacción
      for (const { to, title, qrImage } of emailsToSend) {
        try {
          const base64Data = qrImage.replace(/^data:image\/png;base64,/, "");

          await resend.emails.send({
            from: "Evoments <no-reply@resend.dev>",
            to,
            subject: `Tu entrada para “${title}”`,
            html: `
              <div style="font-family: system-ui; line-height: 1.5;">
                <img src="https://www.evoments.xyz/LogosEvoments/LogoEvoments-imagotipo.png" width="120" alt="Logo Evoments" />
                <h1>🎫 Tu entrada ya está disponible</h1>
                <p>Presenta este código QR al llegar:</p>
                <img src="cid:qrimagen" alt="QR de entrada" />
                <p>¡Disfruta!</p>
              </div>
            `,
            attachments: [
              {
                filename: "qr.png",
                content: base64Data,
                type: "image/png",
                disposition: "inline",
                content_id: "qrimagen",
              },
            ],
          });
        } catch (e) {
          console.error("Error enviando correo a", to, e);
        }
      }

      console.log("✅ Pago y entradas registrados, correos enviados");
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("❌ Error general en handleWebhook:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
