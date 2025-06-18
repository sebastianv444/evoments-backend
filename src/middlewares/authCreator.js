import prisma from "../config/db.js";

export default async function authCreator(req, res, next) {
  const clerkUserId = req.headers["x-clerk-user-id"];
  if (!clerkUserId) return res.status(401).json({ error: "No auth" });

  const creador = await prisma.creador.findUnique({
    where: { clerkUserId }
  });
  if (!creador) return res.status(403).json({ error: "No eres creador" });

  req.creador = creador;
  next();
}
