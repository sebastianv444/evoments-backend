import express from "express";
import environments from "./src/config/dotenv.js";
import morgan from "morgan";
import ticketmasterRoutes from "./src/routes/ticketmaster.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import stripeRoutes from "./src/routes/stripe.routes.js";
import corsMiddleware from "./src/middlewares/cors.js";
import { handleWebhook } from "./src/controllers/webhook.controller.js";
import EventoRoutes from "./src/routes/EventosCrear.routes.js";
import eventRoutes from "./src/routes/events.routes.js";
import adminRouteEvents from "./src/routes/adminRouteEvents.route.js";
import EventosDelPropioCreador from "./src/routes/eventosCreadoresRoute.route.js";
const app = express();

// Configs
app.set("port", environments.app.port);

// Middleware
app.use(morgan("dev"));

// Esta es una excepcion antes de el middleware de express.json().
app.use(
  "/api/stripe/webhook",
  express.raw({ type: "*/*" }),
  (req, res) => {
    console.log("✅ /api/stripe/webhook RAW body recibido");
    return handleWebhook(req, res);
  }
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);

// Routes
app.use("/events", ticketmasterRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/crear", EventoRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/admin", adminRouteEvents);
app.use("/api/eventos-creadores", EventosDelPropioCreador);

app.listen(app.get("port"), () => {
  console.log("Escuchando por el puerto: " + app.get("port"));
});
