import express from "express";
import environments from "./src/config/dotenv.js";
import morgan from "morgan";
const app = express();

// Configs
app.set("port", environments.app.port);

// Middleware
app.use(morgan("dev"));

app.listen(app.get("port"), () => {
  console.log("Escuchando por el puerto: " + app.get("port"));
});
