import prisma from "../config/db.js";

export async function searchEventsHandler(req, res) {
  const q = String(req.query.q || "").trim();
  console.log("Buscando en backend:", q);
  if (q.length < 2) {
    return res.json({ events: [] });
  }
  try {
    const events = await prisma.evento.findMany({
      where: {
        titulo: {
          contains: q,
        },
        estado: "ACTIVO",
      },
      orderBy: { fechaEvento: "asc" },
      take: 10,
      select: {
        id: true,
        titulo: true,
        fechaEvento: true,
        imagen: true,
        categoria: true,
        descripcion: true,
        estado: true,
        creador: {
          select: {
            nombre: true,
            clerkUserId: true,
          },
        },
        zonasEvento: {
          select: {
            id: true,
            nombre: true,
            capacidad: true,
            precioBase: true,
          },
        },
      },
    });
    console.log(events);
    res.json({ events });
  } catch (err) {
    console.error("Error en searchEvents:", err);
    res.status(500).json({ error: "Error interno" });
  }
}
