import prisma from "../config/db.js";

export async function getUserByClerkId(clerkUserId) {
  return prisma.cliente.findUnique({ where: { clerkUserId } });
}

export async function getUserByStripeAccountId(stripeAccountId) {
  return prisma.cliente.findUnique({ where: { stripeAccountId } });
}

export async function saveStripeAccountId(clerkUserId, stripeAccountId) {
  return prisma.cliente.update({
    where: { clerkUserId },
    data: { stripeAccountId },
  });
}

export async function getCreatorByClerkId(clerkUserId) {
  return prisma.creador.findUnique({
    where: { clerkUserId },
  });
}

export async function promoteToCreator(cliente) {
  return prisma.$transaction([
    prisma.cliente.delete({ where: { id: cliente.id } }),
    prisma.creador.create({
      data: {
        clerkUserId: cliente.clerkUserId,
        username: cliente.username,
        nombre: cliente.nombre,
        apellidos: cliente.apellidos,
        email: cliente.email,
        telefono: cliente.telefono,
        stripeAccountId: cliente.stripeAccountId,
      },
    }),
  ]);
}