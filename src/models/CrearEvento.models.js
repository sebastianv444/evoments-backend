import prisma from "../config/db.js";

export const syncCrearEvento = async ({
    titulo,
      descripcion,
      fechaEvento,
      categoria,
      zonas,
}) => {
  return await prisma.evento.upsert({
    where: { clerkUserId: clerkId },
    create: {
      titulo: titulo,
      descripcion: descripcion,
      fechaEvento,
      categoria: categoria,
      zonas: zonas,
    },
    update: {
      titulo: titulo,
      descripcion: descripcion,
      fechaEvento: fechaEvento,
      categoria: categoria,
      zonas: zonas,
    },
  });
};