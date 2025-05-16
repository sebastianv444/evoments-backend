import express from "express";
import environments from "./src/config/dotenv.js";
import morgan from "morgan";
import ticketmasterRoutes from "./src/routes/ticketmaster.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import corsMiddleware from "./src/middlewares/cors.js";
/* import { clerkGlobal } from "./src/middlewares/withClerk.js"; */

const app = express();

// Configs
app.set("port", environments.app.port);

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);
/* app.use(clerkGlobal); */ // Clerk parsea cookies aquí (no redirige, solo decodifica sesión)

// Routes
app.use("/events", ticketmasterRoutes);
app.use("/api/users", userRoutes);

app.listen(app.get("port"), () => {
  console.log("Escuchando por el puerto: " + app.get("port"));
});
