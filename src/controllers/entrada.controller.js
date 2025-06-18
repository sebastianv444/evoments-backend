import prisma from "../config/db.js";

export async function scanEntradaHandler(req, res) {
  const { token } = req.params;
  const creador = req.creador;

  const entrada = await prisma.entrada.findUnique({
    where: { qrToken: token },
    include: { evento: true },
  });
  if (!entrada) return res.status(404).json({ error: "Entrada no existe" });
  if (entrada.evento.creadorId !== creador.id)
    return res.status(403).json({ error: "No autorizado" });
  if (entrada.estado === "USADA")
    return res.status(400).json({ error: "Ya usada" });

  await prisma.entrada.update({
    where: { id: entrada.id },
    data: { estado: "USADA" },
  });
  res.json({ success: true });
}
